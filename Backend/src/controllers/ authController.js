const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    console.log("Received POST request:", req.body);

    const {
      username,
      name,
      email,
      password,
      picture,
      linkedinLink,
      githubLink,
      portfolioLink,
      skillsProficientAt,
      skillsToLearn,
      education,
      bio,
      projects,
    } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "Username, Name, Email, and Password are required." });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    console.log("Existing User Found:", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password before saving:", hashedPassword);
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword, // Store hashed password
      picture,
      linkedinLink,
      githubLink,
      portfolioLink,
      skillsProficientAt,
      skillsToLearn,
      education,
      bio,
      projects,
    });

    await newUser.save();
    console.log("New User Saved:", newUser);

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "User registered successfully.", token });

  } catch (error) {
    console.error("Error in registerController:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Fetch user and explicitly select the password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "User not found. Please register first." });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    if (!user.password) {
      return res.status(500).json({ message: "Error: Stored password is undefined." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful.", token });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in user." });
  }
};

module.exports = {
  registerController,
  loginController
};