const express = require("express");
const router = express.Router();
const {
  getAllChatHistory,
  createChatHistory,
  getChatHistoryById,
  deleteChatHistoryById,
  editChatHistoryById
} = require("./chat_history.service");

// GET all chat history
router.get("/", async (req, res) => {
  try {
    const chats = await getAllChatHistory();
    res.send(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET chat history by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const chat = await getChatHistoryById(id);
    res.send(chat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// POST new chat history
router.post("/", async (req, res) => {
  try {
    const newChat = req.body;

    // Optional: isi otomatis nilai tambahan jika pakai session
    // newChat.user_id = req.session.user?.id || "anonymous";

    const chat = await createChatHistory(newChat);

    // console.log(chat)

    res.send({
      message: "Success create chat!",
      data: chat,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DELETE chat history by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteChatHistoryById(id);
    res.send({
      message: "Chat history deleted successfully!"
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// PUT update full chat history
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (!data) {
      return res.status(400).send("Some field are missing");
    }

    const updated = await editChatHistoryById(id, data);
    res.send({
      message: "Edit chat history success",
      data: updated
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// PATCH update partial chat history (opsional)
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const updated = await editChatHistoryById(id, data);
    res.send({
      message: "Partial update success",
      data: updated
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
