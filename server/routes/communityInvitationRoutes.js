const express = require('express');
const router = express.Router();
const communityInvitationController = require('../controllers/communityInvitationController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Send invitation to join community
router.post('/send', communityInvitationController.sendInvitation);

// Get all invitations for the current user (received)
router.get('/received', communityInvitationController.getUserInvitations);

// Get all invitations sent by the current user
router.get('/sent', communityInvitationController.getSentInvitations);

// Accept invitation
router.put('/:invitationId/accept', communityInvitationController.acceptInvitation);

// Decline invitation
router.put('/:invitationId/decline', communityInvitationController.declineInvitation);

// Cancel invitation (only by sender)
router.delete('/:invitationId/cancel', communityInvitationController.cancelInvitation);

module.exports = router; 