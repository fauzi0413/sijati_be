const express = require('express');
const prisma = require("../db");
const { getAllDocuments, getDocumentById, createDocument, deleteDocumentById, editDocumentById, patchDocumentById } = require('./document.service');

const router = express.Router();

const { chunkText } = require("../utils/chunker");
const { getEmbedding } = require("../utils/openai");
const { extractTextFromImage } = require("../utils/ocr");
const { extractTextFromPDF } = require("../utils/pdf");
const { extractTextFromDocx } = require("../utils/docx");
const { convertPDFToImage } = require('../utils/pdfToImage');

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
    let chunks = [];

    // Ekstrak teks terlebih dahulu
    if (["jpg", "jpeg", "png"].includes(ext)) {
      text = await extractTextFromImage(file_base64);
    } else if (ext === "pdf") {
      text = await extractTextFromPDF(file_base64);

      if (!text || text.trim().length < 100) {
        console.warn("Fallback ke OCR karena PDF kosong atau scan...");

        const buffer = Buffer.from(file_base64, "base64");
        const base64Image = await convertPDFToImage(buffer, path.join(__dirname, "../uploads"));
        text = await extractTextFromImage(base64Image);

        if (!text || text.trim() === "") {
          return res.status(400).json({ error: "OCR gagal membaca isi PDF hasil scan." });
        }
      }
    } else if (ext === "docx") {
      text = await extractTextFromDocx(file_base64);
    } else {
      return res.status(400).json({ error: "Jenis file tidak didukung." });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Tidak ada teks ditemukan dalam file." });
    }

    if (text) {
      console.log("📄 Ekstraksi teks selesai. Panjang karakter:", text.length);
      console.log("⏳ Memulai proses chunking...");

      try {
        chunks = chunkText(text, 1000);
        console.log(`📦 Total chunks: ${chunks.length}`);
        console.log('📍 Sample chunk:', chunks[0]);
      } catch (err) {
        console.error("❌ Gagal menjalankan chunkText:", err.message);
      }
    }

    const embeddingChunks = [];

    for (let chunk of chunks.slice(0, 10)) {
      const embed = await getEmbedding(chunk);
      embeddingChunks.push(embed);
    }

    // Buat nama file (tapi jangan simpan dulu)
    const baseName = file_name
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const sanitizedFileName = `${baseName}_${timestamp}_${random}.${ext}`;

    // Simpan ke database terlebih dulu
    const document = await createDocument({
      title,
      type,
      user_id,
      chunks: JSON.stringify(chunks.slice(0, 10)),
      embedding: JSON.stringify(embeddingChunks),
      file_name: sanitizedFileName,
    });

    // Lalu baru simpan file fisik
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const fileBuffer = Buffer.from(file_base64, 'base64');
    const filePath = path.join(uploadsDir, sanitizedFileName);

    try {
      fs.writeFileSync(filePath, fileBuffer);
      console.log("🧾 File berhasil disimpan:", sanitizedFileName);
    } catch (err) {
      console.error("❌ Gagal menyimpan file:", err);
      // Opsional: hapus data dari DB kalau simpan file gagal
      await prisma.document.delete({ where: { doc_id: document.doc_id } });
      return res.status(500).json({ error: "Gagal menyimpan file fisik." });
    }

    res.send({
      data: document,
      message: "Upload & penyimpanan dokumen berhasil.",
    });
  } catch (error) {
    console.error("❌ Gagal memproses dokumen:", error);
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
  try {
    const documentId = req.params.document_id;
    const newDocumentData = req.body;

    if (!newDocumentData.title) return res.status(400).send("title is required");
    if (!newDocumentData.type) return res.status(400).send("type is required");

    const oldDocument = await getDocumentById(documentId);

    let fileToSave = null;      // ⬅️ buffer yang akan disimpan
    let newFileName = null;     // ⬅️ nama file baru
    let text = "";              // ⬅️ hasil ekstraksi teks

    const isFileReplaced = newDocumentData.file_base64 && newDocumentData.file_name;

    // Jika user upload file baru
    if (isFileReplaced) {
      const ext = newDocumentData.file_name.split(".").pop().toLowerCase();
      const baseName = newDocumentData.file_name
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "");

      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      newFileName = `${baseName}_${timestamp}_${random}.${ext}`;

      fileToSave = Buffer.from(newDocumentData.file_base64, "base64");

      // 🔍 Ekstraksi teks
      if (["jpg", "jpeg", "png"].includes(ext)) {
        console.log("📷 Mulai ekstrak teks dari gambar...");
        text = await extractTextFromImage(newDocumentData.file_base64);
      } else if (ext === "pdf") {
        console.log("📄 Mulai ekstrak teks dari PDF...");
        text = await extractTextFromPDF(newDocumentData.file_base64);

        if (!text || text.trim().length < 100) {
          console.warn("⚠️ PDF kosong atau scan. Fallback ke OCR...");
          const buffer = Buffer.from(newDocumentData.file_base64, "base64");
          const base64Image = await convertPDFToImage(buffer, path.join(__dirname, "../uploads"));
          text = await extractTextFromImage(base64Image);

          if (!text || text.trim() === "") {
            return res.status(400).json({ error: "OCR gagal membaca isi PDF hasil scan." });
          }
        }
      } else if (ext === "docx") {
        console.log("📝 Mulai ekstrak teks dari DOCX...");
        text = await extractTextFromDocx(newDocumentData.file_base64);
      } else {
        return res.status(400).json({ error: "Jenis file tidak didukung." });
      }

      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Tidak ada teks ditemukan dalam file." });
      }

      console.log("📄 Ekstraksi teks selesai. Panjang karakter:", text.length);

      const chunks = chunkText(text, 500);
      const embedding = await getEmbedding(text);

      console.log("✂️ Jumlah chunks:", chunks.length);
      console.log("🧠 Panjang embedding:", Array.isArray(embedding) ? embedding.length : "bukan array");

      newDocumentData.chunks = JSON.stringify(chunks.slice(0, 10));
      newDocumentData.embedding = JSON.stringify(embedding);
      newDocumentData.file_name = newFileName;
    }

    // Validasi chunks & embedding tetap wajib (untuk PUT)
    if (!newDocumentData.chunks) return res.status(400).send("chunks is required");
    if (!newDocumentData.embedding) return res.status(400).send("embedding is required");

    // 💾 Update ke database dulu
    const updated = await editDocumentById(documentId, newDocumentData);

    // ✅ Baru simpan file fisik jika ada perubahan
    if (isFileReplaced && fileToSave && newFileName) {
      const uploadsDir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      const filePath = path.join(uploadsDir, newFileName);
      fs.writeFileSync(filePath, fileToSave);
      console.log("🧾 File baru disimpan:", newFileName);

      // 🗑️ Hapus file lama
      const oldFilePath = path.join(uploadsDir, oldDocument.file_name);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("🗑️ File lama dihapus:", oldDocument.file_name);
      }
    }

    res.send({
      data: updated,
      message: "edit document success",
    });
  } catch (err) {
    console.error("❌ Error saat update dokumen:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat update dokumen" });
  }
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

router.get("/stats/category", async (req, res) => {
  try {
    const result = await prisma.document.groupBy({
      by: ['type'],
      _count: { type: true },
    });

    const data = result.map((item) => ({
      name: item.type,
      value: item._count.type,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghitung statistik kategori dokumen");
  }
});

module.exports = router;