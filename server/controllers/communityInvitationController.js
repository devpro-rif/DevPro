const { User, Community, CommunityInvitation, CommunityMemberModel } = require('../database/index');
const { Op } = require('sequelize');

// Send invitation to join community
exports.sendInvitation = async (req, res) => {
  try {
    const { communityId, inviteeEmail, message } = req.body;
    const inviterId = req.user.id; // Assuming you have user authentication middleware

    // Check if community exists
    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if inviter is a member of the community
    const inviterMembership = await CommunityMemberModel.findOne({
      where: {
        UserId: inviterId,
        CommunityId: communityId
      }
    });

    if (!inviterMembership) {
      return res.status(403).json({ error: 'You must be a member of the community to send invitations' });
    }

    // Find the invitee by email
    const invitee = await User.findOne({
      where: { email: inviteeEmail }
    });

    if (!invitee) {
      return res.status(404).json({ error: 'User with this email not found' });
    }

    // Check if user is already a member
    const existingMembership = await CommunityMemberModel.findOne({
      where: {
        UserId: invitee.id,
        CommunityId: communityId
      }
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'User is already a member of this community' });
    }

    // Check if there's already a pending invitation
    const existingInvitation = await CommunityInvitation.findOne({
      where: {
        inviterId,
        inviteeId: invitee.id,
        communityId,
        status: 'pending'
      }
    });

    if (existingInvitation) {
      return res.status(400).json({ error: 'An invitation has already been sent to this user' });
    }

    // Create the invitation
    const invitation = await CommunityInvitation.create({
      inviterId,
      inviteeId: invitee.id,
      communityId,
      message: message || null,
      invitedRole: 'contributor'
    });

    // Include related data in response
    const invitationWithDetails = await CommunityInvitation.findByPk(invitation.id, {
      include: [
        { model: User, as: 'Inviter', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'Invitee', attributes: ['id', 'username', 'email'] },
        { model: Community, attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(invitationWithDetails);
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all invitations for a user (received)
exports.getUserInvitations = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user authentication middleware

    const invitations = await CommunityInvitation.findAll({
      where: {
        inviteeId: userId,
        status: 'pending',
        expiresAt: {
          [Op.gt]: new Date() // Only show non-expired invitations
        }
      },
      include: [
        { model: User, as: 'Inviter', attributes: ['id', 'username', 'email'] },
        { model: Community, attributes: ['id', 'name', 'description', 'image'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Accept invitation
exports.acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.id;

    const invitation = await CommunityInvitation.findOne({
      where: {
        id: invitationId,
        inviteeId: userId,
        status: 'pending',
        expiresAt: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found or expired' });
    }

    // Update invitation status
    await invitation.update({ status: 'accepted' });

    // Add user to community with contributor role
    await CommunityMemberModel.create({
      UserId: userId,
      CommunityId: invitation.communityId,
      role: invitation.invitedRole
    });

    res.status(200).json({ 
      message: 'Invitation accepted successfully',
      invitation 
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Decline invitation
exports.declineInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.id;

    const invitation = await CommunityInvitation.findOne({
      where: {
        id: invitationId,
        inviteeId: userId,
        status: 'pending'
      }
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // Update invitation status
    await invitation.update({ status: 'declined' });

    res.status(200).json({ 
      message: 'Invitation declined successfully',
      invitation 
    });
  } catch (error) {
    console.error('Error declining invitation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get invitations sent by a user
exports.getSentInvitations = async (req, res) => {
  try {
    const userId = req.user.id;

    const invitations = await CommunityInvitation.findAll({
      where: {
        inviterId: userId
      },
      include: [
        { model: User, as: 'Invitee', attributes: ['id', 'username', 'email'] },
        { model: Community, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error('Error fetching sent invitations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel invitation (only by the sender)
exports.cancelInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.id;

    const invitation = await CommunityInvitation.findOne({
      where: {
        id: invitationId,
        inviterId: userId,
        status: 'pending'
      }
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    await invitation.destroy();

    res.status(200).json({ message: 'Invitation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    res.status(500).json({ error: error.message });
  }
}; 