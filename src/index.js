const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

dotenv.config();
app.use(express.json()); // ⬅️ ini WAJIB untuk parsing body JSON
app.use(cors()); // ⬅️ ini WAJIB untuk mengizinkan CORS

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('API SI JATI!');
});

// CHAT HISTORY API
const chatHistory = require('./chat_history/chat_history.controller.js');
app.use('/chat-history', chatHistory);

// FAQ MANUAL API
const faqManual = require('./faq_manual/faq_manual.controller.js');
app.use('/faq-manual', faqManual);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});