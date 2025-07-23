const Chat = require("../models/Chat");
const User = require("../models/User");

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;
    
    // Validate user IDs
    if (!userId || !receiverId) {
      return res.status(400).json({ message: "Both user IDs are required" });
    }
    
    // Find messages where the current user is either sender or receiver
    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }
      ]
    })
    .sort({ timestamp: 1 })
    .populate("sender", "username picture")
    .populate("receiver", "username picture");
    
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    
    // Validate input
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "Sender ID, receiver ID, and message are required" });
    }
    
    // Check if users exist
    const senderExists = await User.findById(senderId);
    const receiverExists = await User.findById(receiverId);
    
    if (!senderExists || !receiverExists) {
      return res.status(404).json({ message: "One or both users not found" });
    }
    
    // Create new message
    const newMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      message
    });
    
    await newMessage.save();
    
    // Populate sender and receiver info before sending response
    const populatedMessage = await Chat.findById(newMessage._id)
      .populate("sender", "username picture")
      .populate("receiver", "username picture");
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { userId, senderId } = req.params;
    
    const result = await Chat.updateMany(
      { sender: senderId, receiver: userId, read: false },
      { $set: { read: true } }
    );
    
    res.json({ message: "Messages marked as read", count: result.nModified });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};
