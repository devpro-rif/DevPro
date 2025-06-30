const { Community, User, CommunityMemberModel } = require('../database/index');

// Create a new community
exports.createCommunity = async (req, res) => {
  try {
    const { name, description, image, category } = req.body;
    const community = await Community.create({ name, description, image, category });
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all communities
exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll();
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single community by ID
exports.getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findByPk(id);
    if (!community) return res.status(404).json({ error: 'Community not found' });
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a community
exports.updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, category } = req.body;
    const community = await Community.findByPk(id);
    if (!community) return res.status(404).json({ error: 'Community not found' });
    await community.update({ name, description, image, category });
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a community
exports.deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findByPk(id);
    if (!community) return res.status(404).json({ error: 'Community not found' });
    await community.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get community members
exports.getCommunityMembers = async (req, res) => {
  try {
    const { communityId } = req.params;
    
    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const members = await CommunityMemberModel.findAll({
      where: { CommunityId: communityId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'profileImage']
        }
      ]
    });

    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching community members:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check if user is member of community
exports.checkMembership = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user.id; // Assuming you have user authentication middleware

    const membership = await CommunityMemberModel.findOne({
      where: {
        UserId: userId,
        CommunityId: communityId
      }
    });

    res.status(200).json({
      isMember: !!membership,
      role: membership ? membership.role : null
    });
  } catch (error) {
    console.error('Error checking membership:', error);
    res.status(500).json({ error: error.message });
  }
}; 