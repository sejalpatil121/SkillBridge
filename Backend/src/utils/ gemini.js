const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getSkillMatches = async (skillsProficientAt, skillsToLearn) => {
  try {
    
    const users = await User.find({
      $or: [
        { skillsProficientAt: { $in: skillsProficientAt } },
        { skillsToLearn: { $in: skillsToLearn } },
      ],
    });

    
    const matches = users.map((user) => ({
      name: user.name,
      skillsProficientAt: user.skillsProficientAt,
      skillsToLearn: user.skillsToLearn,
      matchScore: calculateMatchScore(user, skillsProficientAt, skillsToLearn),
    }));

    return matches;
  } catch (error) {
    console.error("Error fetching skill matches:", error);
    throw error;
  }
};


const calculateMatchScore = (user, skillsProficientAt, skillsToLearn) => {
  const proficientMatches = user.skillsProficientAt.filter((skill) =>
    skillsProficientAt.includes(skill)
  ).length;

  const learnMatches = user.skillsToLearn.filter((skill) =>
    skillsToLearn.includes(skill)
  ).length;

  
  const totalMatches = proficientMatches + learnMatches;
  const totalSkills = skillsProficientAt.length + skillsToLearn.length;
  return totalMatches / totalSkills;
};

const getTechStackSuggestions = async (projectDescription) => {
  try {
    const prompt = `
      You are a tech stack recommendation assistant. Based on the following project description, suggest the best technologies to use.
      
      Project Description: ${projectDescription}

      Return the results as a JSON array of objects with the following format:
      [
        {
          "category": "Frontend",
          "technologies": ["React", "Next.js", "Tailwind CSS"]
        },
        {
          "category": "Backend",
          "technologies": ["Node.js", "Express", "MongoDB"]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    
    const techStack = JSON.parse(jsonString);
    return techStack;
  } catch (error) {
    console.error("Error generating tech stack suggestions:", error);
    throw error;
  }
};


module.exports = { getSkillMatches, getTechStackSuggestions };