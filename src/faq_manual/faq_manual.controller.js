const express = require('express');
const router = express.Router();
const service = require('./faq_manual.service');

router.post('/', async (req, res) => {
  try {
    const faq = await service.create(req.body);
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const faqs = await service.findAll();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const faq = await service.findById(req.params.id);
    if (!faq) return res.status(404).json({ error: 'Not found' });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
