const repo = require('./chat_history.repository');

exports.create = async (data) => repo.createChat(data);
exports.findAll = async () => repo.getAllChats();
exports.findById = async (id) => repo.getChatById(id);
