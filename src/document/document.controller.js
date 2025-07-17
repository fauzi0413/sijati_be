const express = require('express');
const prisma = require("../db");
const { getAllDocuments, getDocumentById, createDocument, deleteDocumentById, editDocumentById, patchDocumentById } = require('./document.service');

const router = express.Router();

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
        const newDocumentData = req.body;

        const document = await createDocument(newDocumentData);

        res.send({
            data: document,
            message: "create document success",
        });
    } catch(error) {
        res.status(400).send(error.message);
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