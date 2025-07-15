const prisma = require('../db');

exports.createChat = (data) => prisma.chat_history.create({ data });
exports.getAllChats = () => prisma.chat_history.findMany();
exports.getChatById = (chat_id) => prisma.chat_history.findUnique({ where: { chat_id } });