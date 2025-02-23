import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/user/${id}`);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>{user.username}'s Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Skills Proficient At:</strong> {user.skillsProficientAt.join(", ")}</p>
      <p><strong>Skills To Learn:</strong> {user.skillsToLearn.join(", ")}</p>
    </div>
  );
};

export default Profile;