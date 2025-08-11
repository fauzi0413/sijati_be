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

const findChatHistoryByUserId = async (user_id) => {
  const allChats = await prisma.chat_history.findMany({
    where: { user_id },
    orderBy: [
      { session_id: 'asc' }, // Group agar urutan konsisten
      { created_at: 'asc' }, // Urutkan dalam setiap group
    ],
  });

  const grouped = allChats.reduce((acc, chat) => {
    if (!acc[chat.session_id]) acc[chat.session_id] = [];
    acc[chat.session_id].push(chat);
    return acc;
  }, {});

  return Object.entries(grouped).map(([session_id, chats]) => ({
    session_id,
    chats,
  }));
};

// Ambil semua chat berdasarkan session_id
const findChatHistoryBySessionId = async (session_id) => {
  if (!session_id) {
    throw new Error("Session ID is required");
  }
  else{
    const chats = await prisma.chat_history.findMany({
        where: { session_id },
        orderBy: { created_at: "asc" }, // urut berdasarkan waktu
      });
      
    return chats;
  }
};


const getChatCountByHour = async () => {
  const chats = await prisma.chat_history.findMany({
    select: { created_at: true },
  });
  const jamCount = Array(24).fill(0);
  chats.forEach(chat => {
    const jam = new Date(chat.created_at).getHours();
    jamCount[jam]++;
  });
  return jamCount.map((jumlah, i) => ({
    jam: i.toString().padStart(2, "0"),
    jumlah,
  }));
};

const countAllChats = async () => {
  return await prisma.chat_history.count();
};

const countChatByDateRange = async (range) => {
  const now = new Date();
  let from;

  if (range === "day") {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (range === "week") {
    from = new Date(now);
    from.setDate(now.getDate() - 7);
  } else if (range === "month") {
    from = new Date(now);
    from.setMonth(now.getMonth() - 1);
  } else {
    return await prisma.chat_history.count();
  }

  return await prisma.chat_history.count({
    where: {
      created_at: {
        gte: from,
        lte: now,
      },
    },
  });
};

const getTopTopics = async () => {
  const chats = await prisma.chat_history.findMany({
    select: { retrieved_context: true },
  });

  const topicCounts = {};

  chats.forEach(chat => {
    const context = chat.retrieved_context?.toLowerCase() ?? "";
    
    if (!context) return;

    const topics = context.split(",").map(t => t.trim());

    topics.forEach(topic => {
      if (topic) {
        const capitalized = topic.charAt(0).toUpperCase() + topic.slice(1);
        topicCounts[capitalized] = (topicCounts[capitalized] || 0) + 1;
      }
    });
  });

  return Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3) // ambil top 3
    .map(([topic]) => topic);
};

module.exports = {
    findChatHistory,
    findChatHistoryById,
    insertChatHistory,
    deleteChatHistory,
    editChatHistory,
    findChatHistoryBySessionId,
    findChatHistoryByUserId,
    getChatCountByHour,
    countAllChats,
    countChatByDateRange,
    getTopTopics,    
};
