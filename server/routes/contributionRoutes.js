const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new contribution
router.post('/create', contributionController.createContribution);

// Get all contributions for a specific campaign
router.get('/campaign/:campaignId', contributionController.getContributionsByCampaign);

// Get all contributions by a specific user
router.get('/user/:userId', contributionController.getContributionsByUser);

// Get campaign total (amount raised, contributors count, progress)
router.get('/campaign/:campaignId/total', contributionController.getCampaignTotal);

module.exports = router; 