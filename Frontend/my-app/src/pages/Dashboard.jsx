import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User Data:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    }

    fetchUserData();
  }, []);

  if (!user) {
    return <div className="text-center mt-10 text-gray-600">Loading user data...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">User Dashboard</h2>
        <div className="space-y-2">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.linkedinLink && <p><strong>LinkedIn:</strong> <a href={user.linkedinLink} target="_blank" className="text-blue-600">{user.linkedinLink}</a></p>}
          {user.githubLink && <p><strong>GitHub:</strong> <a href={user.githubLink} target="_blank" className="text-blue-600">{user.githubLink}</a></p>}
          {user.skillsProficientAt && <p><strong>Skills:</strong> {user.skillsProficientAt.join(", ")}</p>}
        </div>
      </div>
    </div>
  );
}