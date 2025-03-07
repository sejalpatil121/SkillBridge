"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        if (!token) {
          setError("No authentication token found. Please log in again.")
          setLoading(false)
          return
        }

        const response = await axios.get("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log("User Data:", response.data)
        setUser(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message)
        setError(error.response?.data?.message || "Failed to load user data. Please try again.")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Format skills for display
  const formatSkills = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return "None listed"
    }
    return skills.map((skill, index) => (
      <span
        key={index}
        className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
      >
        {skill}
      </span>
    ))
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      user.username,
      user.name,
      user.email,
      user.bio,
      user.picture,
      user.linkedinLink,
      user.githubLink,
      user.portfolioLink,
      user.skillsProficientAt && user.skillsProficientAt.length > 0,
      user.skillsToLearn && user.skillsToLearn.length > 0,
      user.education && user.education.length > 0,
      user.projects && user.projects.length > 0,
    ]

    const filledFields = fields.filter(Boolean).length
    return Math.round((filledFields / fields.length) * 100)
  }

  const profileCompletion = calculateProfileCompletion()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Logo"
                />
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "overview"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("skills")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "skills"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    Skills
                  </button>
                  {user.projects && user.projects.length > 0 && (
                    <button
                      onClick={() => setActiveTab("projects")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeTab === "projects"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      Projects
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  Logout
                </button>
                <div className="ml-4 flex items-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                    {user.picture ? (
                      <img
                        src={user.picture || "/placeholder.svg"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  className={`${showMobileMenu ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${showMobileMenu ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${showMobileMenu ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                setActiveTab("overview")
                setShowMobileMenu(false)
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                activeTab === "overview"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveTab("profile")
                setShowMobileMenu(false)
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => {
                setActiveTab("skills")
                setShowMobileMenu(false)
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                activeTab === "skills"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Skills
            </button>
            {user.projects && user.projects.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab("projects")
                  setShowMobileMenu(false)
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                  activeTab === "projects"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Projects
              </button>
            )}
            <button
              onClick={handleLogout}
              className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                  {user.picture ? (
                    <img
                      src={user.picture || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <div className="md:col-span-2 bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h2>
                  <p className="mt-1 text-gray-600">Here's an overview of your profile and activity.</p>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-700">Profile Completion</h3>
                    <div className="mt-2 relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            {profileCompletion}% Complete
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div
                          style={{ width: `${profileCompletion}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
                        ></div>
                      </div>
                    </div>

                    {profileCompletion < 100 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Complete your profile to unlock all features:</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          {!user.bio && (
                            <li className="flex items-center">
                              <span className="mr-2 text-red-500">•</span> Add a bio
                            </li>
                          )}
                          {!user.picture && (
                            <li className="flex items-center">
                              <span className="mr-2 text-red-500">•</span> Upload a profile picture
                            </li>
                          )}
                          {(!user.skillsProficientAt || user.skillsProficientAt.length === 0) && (
                            <li className="flex items-center">
                              <span className="mr-2 text-red-500">•</span> Add your skills
                            </li>
                          )}
                          {(!user.education || user.education.length === 0) && (
                            <li className="flex items-center">
                              <span className="mr-2 text-red-500">•</span> Add education details
                            </li>
                          )}
                          {(!user.projects || user.projects.length === 0) && (
                            <li className="flex items-center">
                              <span className="mr-2 text-red-500">•</span> Add projects
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Quick Info</h3>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-gray-600">{user.username}</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-600">{user.email}</span>
                    </div>

                    {user.skillsProficientAt && user.skillsProficientAt.length > 0 && (
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <div>
                          <span className="text-gray-600 block mb-1">Top Skills:</span>
                          <div className="flex flex-wrap">
                            {user.skillsProficientAt.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                              >
                                {skill}
                              </span>
                            ))}
                            {user.skillsProficientAt.length > 3 && (
                              <span className="inline-block text-xs text-gray-500 px-2 py-1">
                                +{user.skillsProficientAt.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap">
                      {user.linkedinLink && (
                        <a
                          href={user.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mr-3 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                          LinkedIn
                        </a>
                      )}

                      {user.githubLink && (
                        <a
                          href={user.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mr-3 text-gray-700 hover:text-gray-900"
                        >
                          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}

                      {user.portfolioLink && (
                        <a
                          href={user.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-600 hover:text-purple-800"
                        >
                          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                          </svg>
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View full profile →
                  </button>
                </div>
              </div>

              {/* Recent Activity or Projects Preview */}
              {user.projects && user.projects.length > 0 && (
                <div className="md:col-span-3 bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700">Recent Projects</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.projects.slice(0, 3).map((project, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="px-4 py-5 sm:p-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-2">{project.title}</h4>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                            {project.techStack && project.techStack.length > 0 && (
                              <div className="flex flex-wrap mt-2">
                                {project.techStack.slice(0, 3).map((tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.techStack.length > 3 && (
                                  <span className="inline-block text-xs text-gray-500 px-2 py-1">
                                    +{project.techStack.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            {project.projectLink && (
                              <div className="mt-4">
                                <a
                                  href={project.projectLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  View project →
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {user.projects.length > 3 && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setActiveTab("projects")}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View all projects
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information.</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Edit Profile
                </button>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.username}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                  </div>
                  {user.bio && (
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.bio}</dd>
                    </div>
                  )}
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Social profiles</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <ul className="space-y-2">
                        {user.linkedinLink && (
                          <li>
                            <a
                              href={user.linkedinLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                              LinkedIn
                            </a>
                          </li>
                        )}

                        {user.githubLink && (
                          <li>
                            <a
                              href={user.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-gray-700 hover:text-gray-900"
                            >
                              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                              GitHub
                            </a>
                          </li>
                        )}

                        {user.portfolioLink && (
                          <li>
                            <a
                              href={user.portfolioLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-purple-600 hover:text-purple-800"
                            >
                              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                              </svg>
                              Portfolio
                            </a>
                          </li>
                        )}
                      </ul>
                    </dd>
                  </div>

                  {user.education && user.education.length > 0 && (
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Education</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="divide-y divide-gray-200">
                          {user.education.map((edu, index) => (
                            <li key={index} className={index > 0 ? "pt-3 mt-3" : ""}>
                              <div className="font-medium">{edu.institution}</div>
                              <div>{edu.degree}</div>
                              {edu.startDate && edu.endDate && (
                                <div className="text-gray-500 text-sm">
                                  {new Date(edu.startDate).toLocaleDateString()} -{" "}
                                  {new Date(edu.endDate).toLocaleDateString()}
                                </div>
                              )}
                              {edu.description && <div className="mt-1 text-sm text-gray-600">{edu.description}</div>}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Proficient At */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Skills Proficient At</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Your current expertise and capabilities.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">{formatSkills(user.skillsProficientAt)}</div>
                </div>
              </div>

              {/* Skills To Learn */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Skills To Learn</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Skills you're interested in developing.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">{formatSkills(user.skillsToLearn)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && user.projects && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Projects</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Your portfolio of work and contributions.</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Add Project
                </button>
              </div>
              <div className="border-t border-gray-200">
                {user.projects.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {user.projects.map((project, index) => (
                      <li key={index} className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                            {project.startDate && project.endDate && (
                              <div className="text-sm text-gray-500 mt-1">
                                {new Date(project.startDate).toLocaleDateString()} -{" "}
                                {new Date(project.endDate).toLocaleDateString()}
                              </div>
                            )}
                            <p className="mt-2 text-sm text-gray-600">{project.description}</p>

                            {project.techStack && project.techStack.length > 0 && (
                              <div className="mt-3 flex flex-wrap">
                                {project.techStack.map((tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {project.projectLink && (
                            <div className="mt-3 md:mt-0 md:ml-6">
                              <a
                                href={project.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                View Project
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="ml-2 -mr-1 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-5 sm:px-6 text-center">
                    <p className="text-gray-500">No projects added yet.</p>
                    <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Add Your First Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

