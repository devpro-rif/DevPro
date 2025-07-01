const db = require('../database/index');
const User = db.User;
const Campaign = db.Campaign;
const Community = db.Community;
const CommunityCampaign = db.CommunityCampaign;
const Contribution = db.Contribution;
const { refreshAllCampaignStatuses, getCampaignStats: getCampaignStatsUtil } = require('../utils/campaignUtils');

// Campaign actions

// Create campaign
const createCampaign = async (req, res) => {
    const user_id = req.user.id;
    const { title, description, objective, goalAmount, image, deadline, communityIds } = req.body;

    if (!title || !description || !objective || !goalAmount || !image || !deadline) {
        return res.status(400).json({ message: "All campaign fields are required." });
    }

    // Validate goal amount
    if (goalAmount <= 0) {
        return res.status(400).json({ message: "Goal amount must be greater than 0." });
    }

    // Validate deadline
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    
    // Check if deadline is in the past
    if (deadlineDate <= currentDate) {
        return res.status(400).json({ 
            message: "Campaign deadline must be set in the future. Please select a future date." 
        });
    }

    // Check if deadline is too far in the future (optional: limit to 2 years)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    
    if (deadlineDate > twoYearsFromNow) {
        return res.status(400).json({ 
            message: "Campaign deadline cannot be more than 2 years in the future." 
        });
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
            currentAmount: 0,
            status: 'active',
            image: image,
            deadline: deadlineDate,
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
    const { title, description, objective, goalAmount, image, deadline, communityIds, status } = req.body;

    try {
        const this_campaign = await Campaign.findByPk(campaign_id);
        if (!this_campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        // Validate goal amount if provided
        if (goalAmount !== undefined && goalAmount <= 0) {
            return res.status(400).json({ message: "Goal amount must be greater than 0." });
        }

        // Validate deadline if provided
        if (deadline) {
            const currentDate = new Date();
            const deadlineDate = new Date(deadline);
            
            // Check if deadline is in the past
            if (deadlineDate <= currentDate) {
                return res.status(400).json({ 
                    message: "Campaign deadline must be set in the future. Please select a future date." 
                });
            }

            // Check if deadline is too far in the future (optional: limit to 2 years)
            const twoYearsFromNow = new Date();
            twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
            
            if (deadlineDate > twoYearsFromNow) {
                return res.status(400).json({ 
                    message: "Campaign deadline cannot be more than 2 years in the future." 
                });
            }
        }

        // Update only provided fields
        if (title) this_campaign.title = title;
        if (description) this_campaign.description = description;
        if (objective) this_campaign.objective = objective;
        if (goalAmount) this_campaign.goalAmount = goalAmount;
        if (image) this_campaign.image = image;
        if (deadline) this_campaign.deadline = new Date(deadline);
        if (status && ['active', 'completed', 'expired', 'cancelled'].includes(status)) {
            this_campaign.status = status;
        }

        await this_campaign.save();

        // Update community associations if provided
        if (communityIds) {
            await this_campaign.setCommunities(communityIds);
        }

        // Fetch the updated campaign with communities
        const campaignWithCommunities = await Campaign.findByPk(this_campaign.id, {
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
                attributes: ['id', 'title', 'description', 'objective', 'goalAmount', 'currentAmount', 'status', 'image', 'deadline', 'createdAt', 'updatedAt', 'UserId']
            }]
        });

        if (!community) {
            return res.status(404).json({ message: "Community not found." });
        }

        return res.status(200).json({
            message: "Community campaigns:",
            community: community
        });
    } catch (error) {
        console.error("Error getting community campaigns:", error);
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

// Get campaigns by status
const getCampaignsByStatus = async (req, res) => {
    const status = req.params.status;

    if (!['active', 'completed', 'expired', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'active', 'completed', 'expired', or 'cancelled'." });
    }

    try {
        const campaigns = await Campaign.findAll({
            where: { status: status },
            include: [{
                model: Community,
                through: { attributes: [] },
                attributes: ['id', 'name', 'description', 'image', 'category']
            }]
        });

        if (!campaigns || campaigns.length === 0) {
            return res.status(404).json({ message: `No ${status} campaigns found.` });
        }

        return res.status(200).json({
            message: `${status.charAt(0).toUpperCase() + status.slice(1)} campaigns:`,
            campaigns: campaigns
        });
    } catch (error) {
        console.error("Error getting campaigns by status:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Refresh all campaign statuses
const refreshAllCampaignStatusesController = async (req, res) => {
    try {
        const result = await refreshAllCampaignStatuses();
        
        res.status(200).json({
            message: "All campaign statuses refreshed successfully",
            ...result
        });
    } catch (error) {
        console.error("Error refreshing campaign statuses:", error);
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
    deleteCampaign,
    getCampaignsByStatus,
    refreshAllCampaignStatuses: refreshAllCampaignStatusesController
}; 