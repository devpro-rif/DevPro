const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware")
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new community
router.post('/', authMiddleware, communityController.createCommunity);

// Get all communities
router.get('/', communityController.getAllCommunities);

// Get a single community by ID
router.get('/:id', communityController.getCommunityById);

// Update a community
router.put('/:id', authMiddleware, communityController.updateCommunity);

// Delete a community
router.delete('/:id', authMiddleware, communityController.deleteCommunity);

// Get community members
router.get('/:communityId/members', communityController.getCommunityMembers);

// Check if user is member of community
router.get('/:communityId/membership', authMiddleware, communityController.checkMembership);

// get user communities 

router.get("/user/communities", auth , communityController.getUserCommunities)

module.exports = router; 