import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, ArrowLeft, User } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  
  // Mock current user ID - in a real app, you would get this from auth context
  const currentUserId = "64f86457b91daa1382a8f436"; // Replace with actual logged-in user ID
  
  useEffect(() => {
    // Fetch user data and chat history
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:5001/api/user/${userId}`);
        setUser(userResponse.data);
        
        // Fetch chat history
        const chatResponse = await axios.get(`http://localhost:5001/api/chat/${currentUserId}/${userId}`);
        setMessages(chatResponse.data);
        
        // Mark messages as read
        await axios.put(`http://localhost:5001/api/chat/read/${currentUserId}/${userId}`);
        
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load chat data");
        toast.error("Failed to load chat data");
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling to check for new messages every 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [userId, currentUserId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      // Send message to API
      const response = await axios.post("http://localhost:5001/api/chat", {
        senderId: currentUserId,
        receiverId: userId,
        message: newMessage
      });
      
      // Add message to UI
      setMessages(prev => [...prev, response.data]);
      setNewMessage("");
      
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-blue-600">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4 text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  {user?.picture ? (
                    <img src={user.picture} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <User className="text-blue-700" size={20} />
                  )}
                </div>
                <div>
                  <h2 className="font-medium">{user?.username || "User"}</h2>
                  <div className="text-xs text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 container mx-auto px-4 py-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message._id} 
                className={`flex ${message.sender._id === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`${
                    message.sender._id === currentUserId 
                      ? "bg-blue-600 text-white" 
                      : "bg-white border border-gray-200 text-gray-800"
                  } rounded-lg px-4 py-2 max-w-md shadow-sm`}
                >
                  <p>{message.message}</p>
                  <p className={`text-xs ${message.sender._id === currentUserId ? "text-blue-100" : "text-gray-500"} mt-1`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t p-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!newMessage.trim()}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;