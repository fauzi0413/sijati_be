const express = require("express");
const router = express.Router();
const { retrieveFAQContext } = require("../utils/retrieveFAQContext");
const { retrieveDocumentContext } = require("../utils/retrieveDocumentContext");

router.post("/", async (req, res) => {
  const { user_message } = req.body;

  try {
    const faqContext = await retrieveFAQContext(user_message);
    const docContext = await retrieveDocumentContext(user_message);
    const retrieved_context = `${faqContext}\n\n${docContext}`;

    res.status(200).json({ retrieved_context });
  } catch (err) {
    console.error("❌ ERROR retrieve-context:", err.message);
    res.status(500).json({ error: "Gagal mengambil konteks" });
  }
});

module.exports = router;
