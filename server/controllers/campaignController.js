const db = require('../database/index');
const User = db.User;
const Campaign = db.Campaign;
const Community = db.Community;
const CommunityCampaign = db.CommunityCampaign;

// Campaign actions

// Create campaign
const createCampaign = async (req, res) => {
    const user_id = req.user.id;
    const { title, description, objective, goalAmount, image, deadline, communityIds } = req.body;

    if (!title || !description || !objective || !goalAmount || !image || !deadline) {
        return res.status(400).json({ message: "All campaign fields are required." });
    }

    try {
        const this_user = await User.findByPk(user_id);
        if (!this_user) {
            return res.status(404).json({ message: "User not found." });
        }

        const this_campaign = await Campaign.create({
            title: title,
            description: description,
            objective: objective,
            goalAmount: goalAmount,
            image: image,
            deadline: deadline,
            UserId: user_id,
        });

        // Link campaign to communities if provided
        if (communityIds && communityIds.length > 0) {
            await this_campaign.setCommunities(communityIds);
        }

        // Fetch the campaign with communities
        const campaignWithCommunities = await Campaign.findByPk(this_campaign.id, {
            include: [{
                model: Community,
                through: { attributes: [] }, // Don't include junction table attributes
                attributes: ['id', 'name', 'description', 'image', 'category']
            }]
        });

        res.status(201).json({
            message: "Campaign created successfully",
            campaign: campaignWithCommunities
        });
    } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Update campaign
const updateCampaign = async (req, res) => {
    const campaign_id = req.params.id_campaign;
    const { title, description, objective, goalAmount, image, deadline, communityIds } = req.body;

    try {
        const this_campaign = await Campaign.findByPk(campaign_id);
        if (!this_campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        // Update only provided fields
        if (title) this_campaign.title = title;
        if (description) this_campaign.description = description;
        if (objective) this_campaign.objective = objective;
        if (goalAmount) this_campaign.goalAmount = goalAmount;
        if (image) this_campaign.image = image;
        if (deadline) this_campaign.deadline = deadline;

        const updated_campaign = await this_campaign.save();

        // Update community associations if provided
        if (communityIds) {
            await updated_campaign.setCommunities(communityIds);
        }

        // Fetch the updated campaign with communities
        const campaignWithCommunities = await Campaign.findByPk(updated_campaign.id, {
            include: [{
                model: Community,
                through: { attributes: [] },
                attributes: ['id', 'name', 'description', 'image', 'category']
            }]
        });

        res.status(200).json({
            message: "Campaign updated successfully",
            campaign: campaignWithCommunities
        });
    } catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get campaign by ID
const getCampaign = async (req, res) => {
    const campaign_id = req.params.id_campaign;

    try {
        const this_campaign = await Campaign.findByPk(campaign_id, {
            include: [{
                model: Community,
                through: { attributes: [] },
                attributes: ['id', 'name', 'description', 'image', 'category']
            }]
        });
        
        if (!this_campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        return res.status(200).json({
            message: "Campaign:",
            campaign: this_campaign
        });
    } catch (error) {
        console.error("Error getting campaign:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get all campaigns
const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({
            include: [{
                model: Community,
                through: { attributes: [] },
                attributes: ['id', 'name', 'description', 'image', 'category']
            }]
        });
        
        if (!campaigns || campaigns.length === 0) {
            return res.status(404).json({ message: "No campaigns found." });
        }

        return res.status(200).json({
            message: "Campaigns:",
            campaigns: campaigns
        });
    } catch (error) {
        console.error("Error getting campaigns:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get campaigns by user
const getCampaignsByUser = async (req, res) => {
    const user_id = req.params.id_user;

    try {
        const campaigns = await Campaign.findAll({
            where: { UserId: user_id },
            include: [{
                model: Community,
                through: { attributes: [] },
                attributes: ['id', 'name', 'description', 'image', 'category']
            }]
        });

        if (!campaigns || campaigns.length === 0) {
            return res.status(404).json({ message: "No campaigns found for this user." });
        }

        return res.status(200).json({
            message: "User campaigns:",
            campaigns: campaigns
        });
    } catch (error) {
        console.error("Error getting user campaigns:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get campaigns by community
const getCampaignsByCommunity = async (req, res) => {
    const community_id = req.params.id_community;

    try {
        const community = await Community.findByPk(community_id, {
            include: [{
                model: Campaign,
                through: { attributes: [] },
                attributes: ['id', 'title', 'description', 'objective', 'goalAmount', 'image', 'deadline', 'createdAt', 'updatedAt', 'UserId']
            }]
        });

        if (!community) {
            return res.status(404).json({ message: "Community not found." });
        }

        return res.status(200).json({
            message: "Community campaigns:",
            community: {
                id: community.id,
                name: community.name,
                campaigns: community.Campaigns
            }
        });
    } catch (error) {
        console.error("Error getting community campaigns:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Link campaign to communities
const linkCampaignToCommunities = async (req, res) => {
    const campaign_id = req.params.id_campaign;
    const { communityIds } = req.body;

    if (!communityIds || !Array.isArray(communityIds)) {
        return res.status(400).json({ message: "Community IDs array is required." });
    }

    try {
        const campaign = await Campaign.findByPk(campaign_id);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        await campaign.setCommunities(communityIds);

        const updatedCampaign = await Campaign.findByPk(campaign_id, {
            include: [{
                model: Community,
                through: { attributes: [] },
                attributes: ['id', 'name', 'description', 'image', 'category']
            }]
        });

        res.status(200).json({
            message: "Campaign linked to communities successfully",
            campaign: updatedCampaign
        });
    } catch (error) {
        console.error("Error linking campaign to communities:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
    const campaign_id = req.params.id_campaign;

    try {
        const this_campaign = await Campaign.findByPk(campaign_id);
        if (!this_campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        await this_campaign.destroy();
        res.status(200).json({ message: "Campaign deleted successfully" });
    } catch (error) {
        console.error("Error deleting campaign:", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    createCampaign,
    updateCampaign,
    getCampaign,
    getAllCampaigns,
    getCampaignsByUser,
    getCampaignsByCommunity,
    linkCampaignToCommunities,
    deleteCampaign
}; 