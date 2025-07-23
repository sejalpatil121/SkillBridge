import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Search as SearchIcon, Loader } from "lucide-react";
import UserCard from "./UserCard";
import { toast } from "sonner";
import axios from "axios";

const UserSearch = () => {
  const [searchType, setSearchType] = useState("skill"); // Default: search by skill
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("Please enter a search term.");
      toast.error("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setUsers([]);

    try {
      let response;
      if (searchType === "id") {
        // Search by ID
        if (!/^[0-9a-fA-F]{24}$/.test(searchInput)) {
          setError("Invalid User ID format.");
          toast.error("Invalid User ID format");
          setLoading(false);
          return;
        }
        response = await axios.get(`http://localhost:5001/api/user/${searchInput}`);
        if (response.data) {
          setUsers([response.data]); // Convert single object to array for consistency
          toast.success("User found");
        }
      } else {
        // Search by skill
        response = await axios.get(`http://localhost:5001/api/user/search?skill=${encodeURIComponent(searchInput)}`);
        setUsers(response.data);
        
        if (response.data.length === 0) {
          toast.info("No users found with this skill");
        } else {
          toast.success(`Found ${response.data.length} user(s)`);
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "No users found.");
      toast.error(err.response?.data?.message || "No users found");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Find Users</h2>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="flex-1">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
          >
            <option value="skill">Search by Skills</option>
            <option value="id">Search by ID</option>
          </select>
        </div>

        <div className="flex-[3] relative">
          <input
            type="text"
            placeholder={searchType === "id" ? "Enter User ID" : "Enter Skill (e.g., JavaScript, React, Design)"}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <SearchIcon size={18} />
          </div>
        </div>

        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center"
        >
          {loading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <span>Search</span>
          )}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {users.length > 0 ? (
        <div className="space-y-4 mt-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      ) : !loading && !error && (
        <div className="text-center py-10 text-gray-500">
          <SearchIcon className="mx-auto mb-4 text-gray-400" size={48} />
          <p>Search for users by entering a skill or user ID above</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;