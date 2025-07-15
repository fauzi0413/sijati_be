const express = require('express');
const router = express.Router();
const service = require('./chat_history.service');

router.post('/', async (req, res) => {
  try {
    const chat = await service.create(req.body);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const chats = await service.findAll();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const chat = await service.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;