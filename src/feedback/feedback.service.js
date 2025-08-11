const {
  createFeedback,
  getAllFeedback,
  getAverageRating,
} = require("./feedback.repository");

const addFeedback = async (data) => {
  return await createFeedback(data);
};

const fetchAllFeedback = async () => {
  return await getAllFeedback();
};

const fetchAverageRating = async () => {
  return await getAverageRating();
};

module.exports = {
  addFeedback,
  fetchAllFeedback,
  fetchAverageRating,
};