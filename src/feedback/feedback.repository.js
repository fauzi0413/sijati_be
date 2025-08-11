const prisma = require("../db");

const createFeedback = async (newFeedback) => {
  return await prisma.feedback.create({ 
    data:newFeedback 
  });
};

const getAllFeedback = async () => {
  return await prisma.feedback.findMany();
};

const getAverageRating = async () => {
  const result = await prisma.feedback.aggregate({
    _avg: { rating: true },
    _count: { _all: true },
  });
  return { average: result._avg.rating || 0, total: result._count._all };
};

module.exports = { 
    createFeedback, 
    getAllFeedback, 
    getAverageRating };