const {
  findFaqManual,
  insertFaqManual,
  findFaqManualById,
  deleteFaqManual,
  editFaqManual,
  findFaqCategoryStats,
} = require("./faq_manual.repository");

const getAllFaqManual = async () => {
  return await findFaqManual();
};

const getFaqManualById = async (id) => {
  const result = await findFaqManualById(id);
  if (!result) throw new Error("FAQ not found");
  return result;
};

const createFaqManual = async (data) => {
  return await insertFaqManual(data);
};

const deleteFaqManualById = async (id) => {
  await getFaqManualById(id);
  await deleteFaqManual(id);
};

const editFaqManualById = async (id, data) => {
  await getFaqManualById(id);
  return await editFaqManual(id, data);
};

const getFaqCategoryStats = async () => {
  return await findFaqCategoryStats();
};

module.exports = {
  getAllFaqManual,
  getFaqManualById,
  createFaqManual,
  deleteFaqManualById,
  editFaqManualById,
  getFaqCategoryStats,
};
