const prisma = require("../db");
const fs = require('fs');
const path = require('path');

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
        data: newDocumentData,
    });

    return document;
};

const deleteDocument = async (document_id) => {
    try {
        // Ambil informasi dokumen dulu (untuk mengetahui nama file)
        const document = await prisma.document.findUnique({
            where: {
                doc_id: document_id,
            },
        });

        if (!document) {
            console.log(`Dokumen dengan id ${document_id} tidak ditemukan.`);
            return;
        }

        // Hapus file dari folder upload
        const filePath = path.join(__dirname, '..', 'uploads', document.file_name);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File ${document.file_name} berhasil dihapus.`);
        } else {
            console.log(`File ${document.file_name} tidak ditemukan di folder upload.`);
        }

        // Hapus dokumen dari database
        await prisma.document.delete({
            where: {
                doc_id: document_id,
            },
        });

        console.log(`Dokumen dengan id ${document_id} berhasil dihapus dari database.`);
    } catch (error) {
        console.error('Gagal menghapus dokumen:', error);
    }
};

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
            updated_at: new Date(),
            ...(newDocumentData.file_name && { file_name: newDocumentData.file_name }) // hanya update jika ada file baru
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