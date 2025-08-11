const express = require("express");
const { 
    addFeedback, 
    fetchAllFeedback, 
    fetchAverageRating
 } = require("./feedback.service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const feedback = await addFeedback(req.body);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const feedback = await fetchAllFeedback();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/average", async (req, res) => {
  try {
    const data = await fetchAverageRating();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;