const express = require("express");
const router = express.Router();
const {
  getAllFaqManual,
  getFaqManualById,
  createFaqManual,
  deleteFaqManualById,
  editFaqManualById
} = require("./faq_manual.service");

router.get("/", async (req, res) => {
  try {
    const faqs = await getAllFaqManual();
    res.send(faqs);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const faq = await getFaqManualById(id);
    res.send(faq);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newFaq = req.body;
    const faq = await createFaqManual(newFaq);

    res.send({
      message: "Success create FAQ!",
      data: faq,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteFaqManualById(id);
    res.send({
      message: "FAQ deleted successfully!",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updated = await editFaqManualById(id, data);
    res.send({
      message: "Edit FAQ success",
      data: updated,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;