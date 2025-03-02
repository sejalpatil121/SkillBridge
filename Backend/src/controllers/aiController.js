const { getSkillMatches, getTechStackSuggestions } = require('../utils/ gemini')

const recommendCollaborators = async (req, res) => {
  const { skillsProficientAt, skillsToLearn } = req.body;

  try {
    
    if (!Array.isArray(skillsProficientAt) || !Array.isArray(skillsToLearn)) {
      return res.status(400).json({ success: false, error: "Invalid input data" });
    }

    
    const matches = await getSkillMatches(skillsProficientAt, skillsToLearn);

    
    res.json({ success: true, matches });
  } catch (error) {
    console.error("Error in recommendCollaborators:", error);
    res.status(500).json({ success: false, error: "Failed to generate recommendations" });
  }
};

const suggestTechStack = async (req, res) => {
  const { projectDescription } = req.body;

  try {
    
    const techStack = await getTechStackSuggestions(projectDescription);

    
    res.json({ success: true, techStack });
  } catch (error) {
    console.error("Error in suggestTechStack:", error);
    res.status(500).json({ success: false, error: "Failed to generate tech stack suggestions" });
  }
};

module.exports = { recommendCollaborators, suggestTechStack };