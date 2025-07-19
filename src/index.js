const express = require('express');
const dotenv = require('dotenv');
const app = express();
const path = require("path");
const cors = require('cors');

dotenv.config();
// app.use(express.json()); // ⬅️ ini WAJIB untuk parsing body JSON
app.use(cors()); // ⬅️ ini WAJIB untuk mengizinkan CORS

const port = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('/', (req, res) => {
  res.send('API SI JATI!');
});

// CHAT HISTORY API
const chatHistory = require('./chat_history/chat_history.controller.js');
app.use('/chat-history', chatHistory);

// FAQ MANUAL API
const faqManual = require('./faq_manual/faq_manual.controller.js');
app.use('/faq-manual', faqManual);

// USERS API
const users = require('./users/user.controller.js');
app.use('/users', users);

// LOGIN LOGS API
const login_logs = require('./loginLog/loginLog.controller.js');
app.use('/login-logs', login_logs);

// DOCUMENTS API
const document = require('./document/document.controller.js');
app.use('/document', document);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});