// Tujuan repository untuk berkomunikasi dengan DATABASE
// Boleh pakai ORM (Prisma), boleh pakai RAW Query

const prisma = require("../db");

// Ambil semua chat
const findChatHistory = async () => {
    const chats = await prisma.chat_history.findMany();
    return chats;
};

// Ambil chat berdasarkan ID
const findChatHistoryById = async (chat_id) => {
    const chat = await prisma.chat_history.findUnique({
        where: {
            chat_id: chat_id, // asumsi chat_id adalah string (UUID)
        },
    });

    return chat;
};

// Tambah chat baru
const insertChatHistory = async (newChat) => {
    const chat = await prisma.chat_history.create({
        data: newChat,
    });

    return chat;
};

// Hapus chat berdasarkan ID
const deleteChatHistory = async (chat_id) => {
    await prisma.chat_history.delete({
        where: {
            chat_id: chat_id,
        },
    });
};

// Ubah data chat berdasarkan ID
const editChatHistory = async (chat_id, updatedChat) => {
    const chat = await prisma.chat_history.update({
        where: {
            chat_id: chat_id,
        },
        data: updatedChat,
    });

    return chat;
};

module.exports = {
    findChatHistory,
    findChatHistoryById,
    insertChatHistory,
    deleteChatHistory,
    editChatHistory,
};
