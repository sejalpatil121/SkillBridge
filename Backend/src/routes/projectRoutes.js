const express = require('express');
const Project = require('../models/Project');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create a new project
router.post('/', async (req, res) => {
  const { title, description, fundingGoal } = req.body;
  try {
    const project = new Project({ title, description, fundingGoal });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contribute to a project
router.post('/:id/contribute', async (req, res) => {
  const { amount, token } = req.body;
  try {
    // Charge the user using Stripe
    const charge = await stripe.charges.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      source: token,
      description: `Contribution to project ${req.params.id}`,
    });

    // Update the project's amountRaised
    const project = await Project.findById(req.params.id);
    project.amountRaised += amount;
    await project.save();

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;