import React, { useState } from "react";
import axios from "axios";

const SkillMatchingForm = () => {
  const [skillsProficientAt, setSkillsProficientAt] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [matches, setMatches] = useState([]);
  const [techStack, setTechStack] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">Find Collaborators</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">
            Skills You're Proficient At:
          </label>
          <input
            type="text"
            value={skillsProficientAt}
            onChange={(e) => setSkillsProficientAt(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">
            Skills You Want to Learn:
          </label>
          <input
            type="text"
            value={skillsToLearn}
            onChange={(e) => setSkillsToLearn(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Project Description:</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Find Matches
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Recommended Tech Stack</h2>
        {techStack.length > 0 ? (
          <div className="grid gap-4 mt-2">
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
        ) : (
          <p className="text-gray-500 text-center mt-2">No tech stack suggestions found.</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Recommended Collaborators</h2>
        {matches.length > 0 ? (
          <div className="grid gap-4 mt-2">
            {matches.map((match, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">{match.name}</h3>
                <p className="text-gray-600"><strong>Proficient At:</strong> {match.skillsProficientAt.join(", ")}</p>
                <p className="text-gray-600"><strong>Wants to Learn:</strong> {match.skillsToLearn.join(", ")}</p>
                <p className="text-gray-700 font-medium"><strong>Match Score:</strong> {match.matchScore}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-2">No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default SkillMatchingForm;