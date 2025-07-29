import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Seach = () => {
  const [searchType, setSearchType] = useState("id"); // Default: search by ID
  const [searchInput, setSearchInput] = useState("");  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("Please enter a search term.");
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
          setLoading(false);
          return;
        }
        response = await axios.get(`http://localhost:5001/api/user/${searchInput}`);
        setUsers([response.data]); // Convert single object to array for consistency
      } else {  
        // Search by Skills
        response = await axios.get(`http://localhost:5001/api/user/search?skill=${searchInput}`);
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("No users found.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div style={styles.container}>
      <h2>Search Users</h2>

      {/* Search Type Dropdown */}
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={styles.select}>
        <option value="id">Search by ID</option>
        <option value="skill">Search by Skills</option>
      </select>

      {/* Search Input */}
      <input
        type="text"
        placeholder={searchType === "id" ? "Enter User ID" : "Enter Skill"}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        style={styles.input}
      />

      {/* Search Button */}
      <button onClick={handleSearch} style={styles.button}>Search</button>

      {/* Display Loading State */}
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* Display Search Results */}
      <ul style={styles.list}>
        {users.map((user) => (
          <li key={user._id} style={styles.listItem}>
            <strong>
              <Link to={`/profile/${user._id}`} style={styles.link}>{user.username}</Link>
            </strong>
            - Proficient in: {user.skillsProficientAt.join(", ")}
            <button onClick={() => handleChat(user._id)} style={styles.chatButton}>Chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { padding: "20px", textAlign: "center" },
  select: { padding: "8px", marginBottom: "10px", width: "200px" },
  input: { padding: "8px", width: "250px", marginRight: "10px" },
  button: { padding: "8px 15px", cursor: "pointer", background: "#007bff", color: "white", border: "none", marginLeft: "10px" },
  error: { color: "red", marginTop: "10px" },
  list: { listStyleType: "none", padding: "0", marginTop: "20px" },
  listItem: { padding: "10px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" },
  link: { textDecoration: "none", color: "#007bff", fontWeight: "bold" },
  chatButton: { padding: "5px 10px", cursor: "pointer", background: "#28a745", color: "white", border: "none", borderRadius: "5px" }
};

export default Seach;
