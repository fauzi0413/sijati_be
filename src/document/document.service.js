const prisma = require("../db");
const { findDocuments, findDocumentById, insertDocument, editDocument, deleteDocument } = require("./document.repository");

const getAllDocuments = async () => {
    const documents = await findDocuments();

    return documents;
};

const getDocumentById = async (document_id) => {
    const document = await findDocumentById(document_id);

    if (!document) {
        throw Error("Document not found")
    }

    return document;
}

const createDocument = async (newDocumentData) => {
    const document = await insertDocument(newDocumentData);

    return document;
};

const deleteDocumentById = async (document_id) => {
    await getDocumentById(document_id);

    await deleteDocument(document_id);
};

const editDocumentById = async (document_id, newDocumentData) => {
    await getDocumentById(document_id);

    const document = await editDocument(document_id, newDocumentData);

    return document;
}

const patchDocumentById = async (document_id, newDocumentData) => {
    await getDocumentById(document_id);

    const document = await editDocument(document_id, newDocumentData);
    return document;
};

module.exports = {
    getAllDocuments,
    getDocumentById,
    createDocument,
    deleteDocumentById,
    editDocumentById,
    patchDocumentById
}