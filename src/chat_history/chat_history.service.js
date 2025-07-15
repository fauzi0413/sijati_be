const {
  findChatHistory,
  insertChatHistory,
  findChatHistoryById,
  deleteChatHistory,
  editChatHistory
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

module.exports = {
  getAllChatHistory,
  getChatHistoryById,
  createChatHistory,
  deleteChatHistoryById,
  editChatHistoryById
};
