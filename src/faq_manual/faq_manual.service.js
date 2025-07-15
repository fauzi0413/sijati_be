const repo = require('./faq_manual.repository');

exports.create = async (data) => repo.createFaq(data);
exports.findAll = async () => repo.getAllFaqs();
exports.findById = async (id) => repo.getFaqById(id);
