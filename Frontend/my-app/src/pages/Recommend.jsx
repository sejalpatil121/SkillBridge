import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Recommend = () => {
  const [activeTab, setActiveTab] = useState("skillMatching"); // 'skillMatching' or 'search'
  const navigate = useNavigate();

  // Search Users State
  const [searchType, setSearchType] = useState("id");
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Skill Matching State
  const [skillsProficientAt, setSkillsProficientAt] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [matches, setMatches] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [matchingLoading, setMatchingLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setSearchError("Please enter a search term.");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setUsers([]);

    try {
      let response;
      if (searchType === "id") {
        if (!/^[0-9a-fA-F]{24}$/.test(searchInput)) {
          setSearchError("Invalid User ID format.");
          setSearchLoading(false);
          return;
        }
        response = await axios.get(`http://localhost:5001/api/user/${searchInput}`);
        setUsers([response.data]);
      } else {
        response = await axios.get(`http://localhost:5001/api/user/search?skill=${searchInput}`);
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setSearchError("No users found.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSkillMatchingSubmit = async (e) => {
    e.preventDefault();
    setMatchingLoading(true);

    try {
      const techStackResponse = await axios.post(
        "http://localhost:5001/api/ai/suggest-tech-stack",
        { projectDescription }
      );
      setTechStack(techStackResponse.data.techStack);

      const matchesResponse = await axios.post(
        "http://localhost:5001/api/ai/recommend",
        {
          skillsProficientAt: skillsProficientAt
            .split(",")
            .map((skill) => skill.trim()),
          skillsToLearn: skillsToLearn
            .split(",")
            .map((skill) => skill.trim()),
        }
      );
      setMatches(matchesResponse.data.matches);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Find Collaborators</h1>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("skillMatching")}
            className={`px-6 py-2 rounded-l-lg font-medium ${activeTab === "skillMatching" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            AI Recommendations
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-2 rounded-r-lg font-medium ${activeTab === "search" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Search Users
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "skillMatching" ? (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <form onSubmit={handleSkillMatchingSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Skills You're Proficient At (comma separated):
                </label>
                <input
                  type="text"
                  value={skillsProficientAt}
                  onChange={(e) => setSkillsProficientAt(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Skills You Want to Learn (comma separated):
                </label>
                <input
                  type="text"
                  value={skillsToLearn}
                  onChange={(e) => setSkillsToLearn(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
                  placeholder="e.g., Python, Machine Learning"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Project Description:</label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
                  rows="4"
                  placeholder="Describe your project to get tech stack suggestions..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                disabled={matchingLoading}
              >
                {matchingLoading ? "Finding Matches..." : "Find Matches"}
              </button>
            </form>

            {/* Tech Stack Suggestions */}
            {techStack.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Tech Stack</h2>
                <div className="grid gap-4">
                  {techStack.map((category, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-800">{category.category}</h3>
                      <ul className="list-disc ml-4 text-gray-600">
                        {category.technologies.map((tech, i) => (
                          <li key={i}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Matches */}
            {matches.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Collaborators</h2>
                <div className="grid gap-4">
                  {matches.map((match, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          <Link to={`/profile/${match._id}`} className="hover:text-indigo-600">
                            {match.username}
                          </Link>
                        </h3>
                        <p className="text-gray-600">
                          <strong>Proficient At:</strong> {match.skillsProficientAt.join(", ")}
                        </p>
                        <p className="text-gray-600">
                          <strong>Wants to Learn:</strong> {match.skillsToLearn.join(", ")}
                        </p>
                        <p className="text-gray-700 font-medium">
                          <strong>Match Score:</strong> {match.matchScore}
                        </p>
                      </div>
                      <button
                        onClick={() => handleChat(match._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="id">Search by ID</option>
                <option value="skill">Search by Skills</option>
              </select>

              <input
                type="text"
                placeholder={searchType === "id" ? "Enter User ID" : "Enter Skill"}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />

              <button
                onClick={handleSearch}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                disabled={searchLoading}
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {searchError && <p className="text-red-500 text-center mb-4">{searchError}</p>}

            {users.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
                <ul className="space-y-3">
                  {users.map((user) => (
                    <li key={user._id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
                      <div>
                        <strong className="text-lg">
                          <Link to={`/profile/${user._id}`} className="text-indigo-600 hover:underline">
                            {user.username}
                          </Link>
                        </strong>
                        <p className="text-gray-600">
                          Proficient in: {user.skillsProficientAt?.join(", ") || "No skills listed"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleChat(user._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Chat
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;