import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5001");

export default function Chat({ loggedInUserId }) {
  const { userId } = useParams(); // Selected user ID from URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    async function fetchChat() {
      try {
        // ✅ Fetch chat history from backend
        const response = await axios.get(`http://localhost:5001/api/messages?sender=${loggedInUserId}&receiver=${userId}`);
        setMessages(response.data);

        // ✅ Get receiver's name
        const userResponse = await axios.get(`http://localhost:5001/api/users/${userId}`);
        setReceiverName(userResponse.data.name);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    }

    fetchChat();

    // ✅ Join chat room for private messaging
    socket.emit("joinRoom", { senderId: loggedInUserId, receiverId: userId });

    // ✅ Listen for incoming messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [loggedInUserId, userId]);

  // ✅ Send message function
  function sendMessage() {
    if (!message.trim()) return;

    const newMessage = {
      senderId: loggedInUserId,
      receiverId: userId,
      text: message,
    };

    // Send message via Socket.IO
    socket.emit("sendMessage", newMessage);

    // Add message to UI instantly
    setMessages((prev) => [...prev, newMessage]);

    // Save message in MongoDB
    axios.post("http://localhost:5001/api/messages", newMessage);
    
    setMessage("");
  }

  return (
    <div>
      <h2>Chat with {receiverName}</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid black", padding: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.senderId === loggedInUserId ? "right" : "left" }}>
            {msg.text}
          </p>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
