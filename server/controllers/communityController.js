const { Community } = require('../database/index');

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