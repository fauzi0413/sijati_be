const {
  findChatHistory,
  insertChatHistory,
  findChatHistoryById,
  deleteChatHistory,
  editChatHistory,
  findChatHistoryByUserId,
  findChatHistoryBySessionId,
  getChatCountByHour,
  countAllChats,
  countChatByDateRange,
  getTopTopics,
} = require("./chat_history.repository");

const getAllChatHistory = async () => {
  const result = await findChatHistory();
  return result;
};

const getChatHistoryById = async (id) => {
  const result = await findChatHistoryById(id);

  if (!result) {
    throw new Error("Chat history not found");
  }

  return result;
};

const createChatHistory = async (newChat) => {
  const result = await insertChatHistory(newChat);
  return result;
};

const deleteChatHistoryById = async (id) => {
  await getChatHistoryById(id); // validasi ada atau tidak
  await deleteChatHistory(id);
};

const editChatHistoryById = async (id, data) => {
  await getChatHistoryById(id); // validasi
  const result = await editChatHistory(id, data);
  return result;
};

const getGroupedChatByUserId = async (user_id) => {
  const allChats = await findChatHistoryByUserId(user_id);
  return allChats;
};

const getChatHistoryBySessionId = async (session_id) => {
  const result = await findChatHistoryBySessionId(session_id);
  return result;
};


const getHourlyStats = async () => await getChatCountByHour();
const getTotalChatCount = async () => await countAllChats();
const getChatCountByRange = async (range) => {
  return await countChatByDateRange(range);
};
const getPopularTopics = async () => await getTopTopics();

module.exports = {
  getAllChatHistory,
  getChatHistoryById,
  createChatHistory,
  deleteChatHistoryById,
  editChatHistoryById,
  getGroupedChatByUserId,
  getChatHistoryBySessionId,
  getHourlyStats,
  getTotalChatCount,
  getChatCountByRange,
  getPopularTopics,
};
