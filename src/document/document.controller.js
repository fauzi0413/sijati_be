const express = require('express');
const prisma = require("../db");
const { getAllDocuments, getDocumentById, createDocument, deleteDocumentById, editDocumentById, patchDocumentById } = require('./document.service');

const router = express.Router();

const { chunkText } = require("../utils/chunker");
const { getEmbedding } = require("../utils/openai");
const { extractTextFromImage } = require("../utils/ocr");
const { extractTextFromPDF } = require("../utils/pdf");
const { extractTextFromDocx } = require("../utils/docx");

const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
    const documents = await getAllDocuments();

    res.send(documents);
});

router.get("/:document_id", async (req, res) => {
    try {
        const document = await getDocumentById(req.params.document_id);

        res.send(document);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/", async (req, res) => {
  try {
    const { title, type, user_id, file_base64, file_name } = req.body;

    if (!title || !type || !user_id || !file_base64 || !file_name) {
      return res.status(400).json({ error: "Semua field wajib diisi." });
    }

    const ext = file_name.split(".").pop().toLowerCase();
    let text = "";

    // 1️⃣ Pastikan folder uploads ada
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // 2️⃣ Simpan file fisik ke folder uploads/
    const baseName = file_name
      .replace(/\.[^/.]+$/, "")          // hapus ekstensi
      .replace(/\s+/g, "_")              // ganti spasi jadi underscore
      .replace(/[^a-zA-Z0-9_-]/g, "");   // hilangkan karakter aneh

    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000); // 0–9999
    const sanitizedFileName = `${baseName}_${timestamp}_${random}.${ext}`;

    const fileBuffer = Buffer.from(file_base64, 'base64');
    const filePath = path.join(__dirname, "../uploads", sanitizedFileName);

    try {
      fs.writeFileSync(filePath, fileBuffer);
      console.log("File berhasil disimpan");
    } catch (err) {
      console.error("Gagal menyimpan file:", err);
    }

    // 3️⃣ Ekstraksi teks berdasarkan jenis file
    if (["jpg", "jpeg", "png"].includes(ext)) {
      text = await extractTextFromImage(file_base64);
    } else if (ext === "pdf") {
      text = await extractTextFromPDF(file_base64);
    } else if (ext === "docx") {
      text = await extractTextFromDocx(file_base64);
    } else {
      return res.status(400).json({ error: "Jenis file tidak didukung." });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Tidak ada teks ditemukan dalam file." });
    }

    // 4️⃣ Proses chunk dan embedding
    const chunks = chunkText(text, 500);
    const embedding = await getEmbedding(text);

    const document = await createDocument({
      title,
      type,
      user_id,
      chunks: chunks[0].slice(0, 100),
      embedding: JSON.stringify(embedding),
      file_name: sanitizedFileName,
    });

    res.send({
      data: document,
      message: "Upload & penyimpanan dokumen berhasil.",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("Gagal memproses dokumen: " + error.message);
  }
});

router.delete("/:document_id", async (req, res) => {
    try {
        const documentId = req.params.document_id;

        await deleteDocumentById(documentId);

        res.send("document deleted");
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.put("/:document_id", async (req, res) => {
    const documentId = req.params.document_id;
    const newDocumentData = req.body;

    if (!newDocumentData.title) {
    return res.status(400).send("title is required");
    }
    if (!newDocumentData.type) {
    return res.status(400).send("type is required");
    }
    if (!newDocumentData.chunks) {
    return res.status(400).send("chunks is required");
    }
    if (!newDocumentData.embedding) {
    return res.status(400).send("embedding is required");
    }

    const document = await editDocumentById(documentId, newDocumentData);

    res.send({
        data: document,
        message: "edit document success",
    })
});

router.patch("/:document_id", async (req, res) => {
    try {
        const documentId = req.params.document_id;
        const newDocumentData = req.body;

        const document = await patchDocumentById(documentId, newDocumentData);

        res.send({
            data: document,
            message: "edit document success",
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;