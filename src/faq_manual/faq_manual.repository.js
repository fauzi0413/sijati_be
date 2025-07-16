const prisma = require("../db");

const findFaqManual = async () => {
  return await prisma.faq_manual.findMany();
};

const findFaqManualById = async (faq_id) => {
  return await prisma.faq_manual.findUnique({
    where: { faq_id },
  });
};

const insertFaqManual = async (data) => {
  return await prisma.faq_manual.create({
    data,
  });
};

const deleteFaqManual = async (faq_id) => {
  await prisma.faq_manual.delete({
    where: { faq_id },
  });
};

const editFaqManual = async (faq_id, data) => {
  return await prisma.faq_manual.update({
    where: { faq_id },
    data,
  });
};

module.exports = {
  findFaqManual,
  findFaqManualById,
  insertFaqManual,
  deleteFaqManual,
  editFaqManual,
};