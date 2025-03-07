"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const navigate = useNavigate()

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
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e, field, index, subField) => {
    if (index !== undefined) {
      setFormData((prev) => {
        const newArr = [...prev[field]]
        newArr[index][subField] = e.target.value
        return { ...prev, [field]: newArr }
      })
    } else {
      setFormData({ ...formData, [field]: e.target.value })
    }
  }

  const handleArrayChange = (e, field, index) => {
    const newArr = [...formData[field]]
    newArr[index] = e.target.value
    setFormData({ ...formData, [field]: newArr })
  }

  const addField = (field, structure) => {
    setFormData({ ...formData, [field]: [...formData[field], structure] })
  }

  const removeField = (field, index) => {
    setFormData((prev) => {
      const newArr = [...prev[field]]
      newArr.splice(index, 1)
      return { ...prev, [field]: newArr }
    })
  }

  const handleTechStackChange = (e, projectIndex, techIndex) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects]
      newProjects[projectIndex].techStack[techIndex] = e.target.value
      return { ...prev, projects: newProjects }
    })
  }

  const addTechStack = (projectIndex) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects]
      newProjects[projectIndex].techStack.push("")
      return { ...prev, projects: newProjects }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      console.log("Registration Response:", response.data)
      alert("Registration successful! Please log in.")
      navigate("/login")
    } catch (error) {
      console.error("Registration error:", error.response?.data)
      setError(error.response?.data?.message || "Registration failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Your Account</h2>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange(e, "username")}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange(e, "name")}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e, "email")}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange(e, "password")}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                <input
                  type="text"
                  value={formData.picture}
                  onChange={(e) => handleChange(e, "picture")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">About You</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange(e, "bio")}
                rows="4"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedinLink}
                  onChange={(e) => handleChange(e, "linkedinLink")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  type="url"
                  value={formData.githubLink}
                  onChange={(e) => handleChange(e, "githubLink")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                <input
                  type="url"
                  value={formData.portfolioLink}
                  onChange={(e) => handleChange(e, "portfolioLink")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Skills</h3>

            {/* Skills Proficient At */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills You're Proficient At</label>
              {formData.skillsProficientAt.map((skill, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange(e, "skillsProficientAt", index)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., JavaScript, React, UI Design"
                  />
                  {formData.skillsProficientAt.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField("skillsProficientAt", index)}
                      className="ml-2 p-2 text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("skillsProficientAt", "")}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Skill
              </button>
            </div>

            {/* Skills To Learn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills You Want to Learn</label>
              {formData.skillsToLearn.map((skill, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange(e, "skillsToLearn", index)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Machine Learning, Cloud Computing"
                  />
                  {formData.skillsToLearn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField("skillsToLearn", index)}
                      className="ml-2 p-2 text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("skillsToLearn", "")}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Skill
              </button>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Education</h3>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-medium text-gray-800">Education #{index + 1}</h4>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField("education", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleChange(e, "education", index, "institution")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="University/College Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleChange(e, "education", index, "degree")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => handleChange(e, "education", index, "startDate")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => handleChange(e, "education", index, "endDate")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Score/GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={edu.score}
                      onChange={(e) => handleChange(e, "education", index, "score")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 3.8"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => handleChange(e, "education", index, "description")}
                    rows="2"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional details about your education..."
                  ></textarea>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addField("education", {
                  institution: "",
                  degree: "",
                  startDate: "",
                  endDate: "",
                  score: 0,
                  description: "",
                })
              }
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Add Education
            </button>
          </div>

          {/* Projects Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Projects</h3>
            {formData.projects.map((proj, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-medium text-gray-800">Project #{index + 1}</h4>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField("projects", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleChange(e, "projects", index, "title")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Project Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                    <input
                      type="url"
                      value={proj.projectLink}
                      onChange={(e) => handleChange(e, "projects", index, "projectLink")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={proj.startDate}
                      onChange={(e) => handleChange(e, "projects", index, "startDate")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={proj.endDate}
                      onChange={(e) => handleChange(e, "projects", index, "endDate")}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => handleChange(e, "projects", index, "description")}
                    rows="2"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your project..."
                  ></textarea>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                  {proj.techStack.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleTechStackChange(e, index, techIndex)}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., React, Node.js, MongoDB"
                      />
                      {proj.techStack.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const newProjects = [...prev.projects]
                              newProjects[index].techStack.splice(techIndex, 1)
                              return { ...prev, projects: newProjects }
                            })
                          }}
                          className="ml-2 p-2 text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTechStack(index)}
                    className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Technology
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addField("projects", {
                  title: "",
                  description: "",
                  projectLink: "",
                  startDate: "",
                  endDate: "",
                  techStack: [""],
                })
              }
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Add Project
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-md text-white font-semibold ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Registering..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

