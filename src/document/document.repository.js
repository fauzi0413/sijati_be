const prisma = require("../db");

const findDocuments = async () => {
    const documents = await prisma.document.findMany();

    return documents;
}

const findDocumentById = async (document_id) => {
    const document = await prisma.document.findUnique({
        where: {
            doc_id: document_id,
        },
    });

    return document;
};

const insertDocument = async (newDocumentData) => {
    const document = await prisma.document.create({
        data: {
            title: newDocumentData.title,
            type: newDocumentData.type,
            chunks: newDocumentData.chunks,
            embedding: newDocumentData.embedding,
            uploaded_by: newDocumentData.uploaded_by
        },
    });

    return document;
};

const deleteDocument = async (document_id) => {
    await prisma.document.delete({
        where: {
            doc_id: document_id,
        },
    });
}

const editDocument = async (document_id, newDocumentData) => {
    const document = await prisma.document.update({
        where: {
            doc_id: document_id,
        },
        data: {
            title: newDocumentData.title,
            type: newDocumentData.type,
            chunks: newDocumentData.chunks,
            embedding: newDocumentData.embedding,
            updated_at: new Date()
        },
    });

    return document;
}

module.exports = {
    findDocuments,
    findDocumentById,
    insertDocument,
    deleteDocument,
    editDocument
};