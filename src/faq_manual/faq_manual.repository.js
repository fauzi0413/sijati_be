const prisma = require('../db');

exports.createFaq = (data) => prisma.faq_manual.create({ data });
exports.getAllFaqs = () => prisma.faq_manual.findMany();
exports.getFaqById = (faq_id) => prisma.faq_manual.findUnique({ where: { faq_id } });