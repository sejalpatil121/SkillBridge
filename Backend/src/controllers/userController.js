const User = require("../models/User");
exports.searchUsersBySkills = async (req, res) => {
    try {
      const { skill } = req.query;
      console.log("Received skill:", skill); 
  
      if (!skill) {
        return res.status(400).json({ message: "Skill query is required" });
      }
  
      
      console.log(`Searching users for skill: ${skill}`);
  // use this for the partial matching of string is required
  
    //   const users = await User.find({
    //     $or: [
    //       { skillsProficientAt: { $regex: new RegExp(skill, "i") } },
    //       { skillsToLearn: { $regex: new RegExp(skill, "i") } }
    //     ]
    //   });
      const users = await User.find({
        $or: [
          { skillsProficientAt: skill },
          { skillsToLearn: skill }
        ]
      });

      console.log("Users found:", users);

      if (users.length === 0) {
        return res.status(404).json({ message: "No users found with this skill" });
      }

      res.json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Server error" });
    }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};