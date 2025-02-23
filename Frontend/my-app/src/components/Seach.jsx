import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const [searchType, setSearchType] = useState("id"); // Default: search by ID
  const [searchInput, setSearchInput] = useState("");  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          return;
        }
        response = await axios.get(`http://localhost:5001/api/user/${searchInput}`);
        setUsers([response.data]);  // Convert single object to array for consistency
      } else {  
        
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

  return (
    <div style={styles.container}>
      <h2>Search Users</h2>

      
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={styles.select}>
        <option value="id">Search by ID</option>
        <option value="skill">Search by Skills</option>
      </select>

      
      <input
        type="text"
        placeholder={searchType === "id" ? "Enter User ID" : "Enter Skill"}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        style={styles.input}
      />

     
      <button onClick={handleSearch} style={styles.button}>Search</button>

      
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      
      <ul style={styles.list}>
        {users.map((user) => (
          <li key={user._id} style={styles.listItem}>
            <strong>
              <Link to={`/profile/${user._id}`} style={styles.link}>{user.username}</Link>  
            </strong> 
            - Proficient in: {user.skillsProficientAt.join(", ")}
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
  button: { padding: "8px 15px", cursor: "pointer", background: "#007bff", color: "white", border: "none" },
  error: { color: "red", marginTop: "10px" },
  list: { listStyleType: "none", padding: "0", marginTop: "20px" },
  listItem: { padding: "10px", borderBottom: "1px solid #ccc" },
  link: { textDecoration: "none", color: "#007bff", fontWeight: "bold" }
};

export default Search;