import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    
    username: "",
    name: "",
    email: "",
    password: "",
    picture: "",
    rating: 0,
    linkedinLink: "",
    githubLink: "",
    portfolioLink: "",
    skillsProficientAt: [""],
    skillsToLearn: [""],
    bio: "",
    education: [
      {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        score: 0,
        description: "",
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        projectLink: "",
        techStack: [""],
        startDate: "",
        endDate: "",
      },
    ],
  });

  const handleChange = (e, field, index, subField) => {
    if (index !== undefined) {
      setFormData((prev) => {
        const newArr = [...prev[field]];
        newArr[index][subField] = e.target.value;
        return { ...prev, [field]: newArr };
      });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleArrayChange = (e, field, index) => {
    const newArr = [...formData[field]];
    newArr[index] = e.target.value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addField = (field, structure) => {
    setFormData({ ...formData, [field]: [...formData[field], structure] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      console.log("Registration Response:", response.data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Register</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Basic Info */}
          {["username", "name", "email", "password", "picture", "linkedinLink", "githubLink", "portfolioLink", "bio"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{field}</label>
              <input
                type={field === "password" ? "password" : "text"}
                value={formData[field]}
                onChange={(e) => handleChange(e, field)}
                className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}

          {/* Skills */}
          {["skillsProficientAt", "skillsToLearn"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{field}</label>
              {formData[field].map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayChange(e, field, index)}
                  className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ))}
              <button
                type="button"
                onClick={() => addField(field, "")}
                className="mt-2 text-indigo-600 hover:underline"
              >
                + Add Skill
              </button>
            </div>
          ))}

          {/* Education */}
          <h3 className="text-lg font-semibold mt-4">Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="border p-3 rounded-md">
              {["institution", "degree", "score", "description"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type="text"
                    value={edu[field]}
                    onChange={(e) => handleChange(e, "education", index, field)}
                    className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
              {["startDate", "endDate"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type="date"
                    value={edu[field]}
                    onChange={(e) => handleChange(e, "education", index, field)}
                    className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("education", { institution: "", degree: "", startDate: "", endDate: "", score: 0, description: "" })}
            className="mt-2 text-indigo-600 hover:underline"
          >
            + Add Education
          </button>

          {/* Projects */}
          <h3 className="text-lg font-semibold mt-4">Projects</h3>
          {formData.projects.map((proj, index) => (
            <div key={index} className="border p-3 rounded-md">
              {["title", "description", "projectLink"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type="text"
                    value={proj[field]}
                    onChange={(e) => handleChange(e, "projects", index, field)}
                    className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
              {["startDate", "endDate"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type="date"
                    value={proj[field]}
                    onChange={(e) => handleChange(e, "projects", index, field)}
                    className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("projects", { title: "", description: "", projectLink: "", startDate: "", endDate: "", techStack: [""] })}
            className="mt-2 text-indigo-600 hover:underline"
          >
            + Add Project
          </button>

          {/* Submit */}
          <button type="submit" className="w-full mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}