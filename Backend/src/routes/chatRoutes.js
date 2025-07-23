const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Get chat history between two users
router.get("/:userId/:receiverId", chatController.getChatHistory);

// Send a new message
router.post("/", chatController.sendMessage);

// Mark messages as read
router.put("/read/:userId/:senderId", chatController.markAsRead);

module.exports = router;