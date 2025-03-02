const express = require("express");
const { recommendCollaborators, suggestTechStack } = require("../controllers/aiController");

const router = express.Router();


router.post("/recommend", recommendCollaborators);


router.post("/suggest-tech-stack", suggestTechStack);

module.exports = router;