import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [loggedUser, setLoggedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersResponse = await axios.get("http://localhost:5001/api/user");

                const sortedUsers = usersResponse.data.sort((a, b) =>
                    (b.skillsProficientAt?.length || 0) - (a.skillsProficientAt?.length || 0)
                );

                setUsers(sortedUsers.slice(0, 4));
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
            }
        };

        const fetchLoggedUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await axios.get("http://localhost:5001/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLoggedUser(response.data);
            } catch (error) {
                console.error("Error fetching logged user:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        fetchLoggedUser();
    }, []);

    const handleChat = (userId) => {
        navigate(`/chat/${userId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Top 3 Users (Username & Skills)</h2>
                <h2 className="text-xl font-bold mb-2 flex justify-between w-full max-w-md">
                    <span>USERNAME</span>
                    <span>SKILLS</span>
                    <span>CHAT</span>
                </h2>
                <ul className="space-y-2">
                    {users.map(user => (
                        <li key={user._id} className="flex justify-between items-center">
                            <a
                                href={`/profile/${user._id}`}
                                className="text-blue-600 underline cursor-pointer"
                            >
                                {user.username}
                            </a>
                            <span className="text-gray-700">
                                {user.skillsProficientAt?.join(", ") || "N/A"}
                            </span>
                            
                        </li>
                    ))}
                </ul>
            </div>
            {loggedUser && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-10">
                    <h2 className="text-2xl font-bold text-center mb-4">Logged-In User Information</h2>
                    <div className="space-y-2 text-center">
                        <p><strong>Username:</strong> {loggedUser.username}</p>
                        <p><strong>Name:</strong> {loggedUser.name}</p>
                        <p><strong>Email:</strong> {loggedUser.email}</p>
                        {loggedUser.linkedinLink && <p><strong>LinkedIn:</strong> <a href={loggedUser.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-blue-600">{loggedUser.linkedinLink}</a></p>}
                        {loggedUser.githubLink && <p><strong>GitHub:</strong> <a href={loggedUser.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600">{loggedUser.githubLink}</a></p>}
                        {loggedUser.skillsProficientAt && <p><strong>Skills:</strong> {loggedUser.skillsProficientAt.join(", ")}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
