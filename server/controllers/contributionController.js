const db = require('../database/index');
const User = db.User;
const Campaign = db.Campaign;
const Contribution = db.Contribution;

// Create contribution
const createContribution = async (req, res) => {
    const user_id = req.user.id;
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
        return res.status(400).json({ message: "Campaign ID and amount are required." });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0." });
    }

    try {
        // Check if user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if campaign exists
        const campaign = await Campaign.findByPk(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        // Check if campaign is active (only active campaigns can receive contributions)
        if (campaign.status !== 'active') {
            return res.status(400).json({ 
                message: "Cannot contribute to this campaign. Only active campaigns can receive contributions." 
            });
        }

        // Create contribution (triggers will automatically update campaign)
        const contribution = await Contribution.create({
            amount: amount,
            UserId: user_id,
            CampaignId: campaignId
        });

        // Fetch the updated campaign (triggers have already updated it)
        const updatedCampaign = await Campaign.findByPk(campaignId);

        res.status(201).json({
            message: "Contribution created successfully",
            contribution: contribution,
            campaign: updatedCampaign
        });
    } catch (error) {
        console.error("Error creating contribution:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get contributions by campaign
const getContributionsByCampaign = async (req, res) => {
    const campaignId = req.params.campaignId;

    try {
        const contributions = await Contribution.findAll({
            where: { CampaignId: campaignId },
            include: [{
                model: User,
                attributes: ['id', 'username', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });

        if (!contributions || contributions.length === 0) {
            return res.status(404).json({ message: "No contributions found for this campaign." });
        }

        return res.status(200).json({
            message: "Campaign contributions:",
            contributions: contributions
        });
    } catch (error) {
        console.error("Error getting campaign contributions:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get contributions by user
const getContributionsByUser = async (req, res) => {
    const user_id = req.params.userId;

    try {
        const contributions = await Contribution.findAll({
            where: { UserId: user_id },
            include: [{
                model: Campaign,
                attributes: ['id', 'title', 'description', 'goalAmount', 'currentAmount', 'status', 'deadline']
            }],
            order: [['createdAt', 'DESC']]
        });

        if (!contributions || contributions.length === 0) {
            return res.status(404).json({ message: "No contributions found for this user." });
        }

        return res.status(200).json({
            message: "User contributions:",
            contributions: contributions
        });
    } catch (error) {
        console.error("Error getting user contributions:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get total contributions for a campaign
const getCampaignTotal = async (req, res) => {
    const campaignId = req.params.campaignId;

    try {
        const campaign = await Campaign.findByPk(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        const contributions = await Contribution.findAll({
            where: { CampaignId: campaignId }
        });

        const totalAmount = contributions.reduce((sum, contribution) => {
            return sum + contribution.amount;
        }, 0);

        const totalContributors = contributions.length;

        return res.status(200).json({
            message: "Campaign total:",
            campaignId: campaignId,
            totalAmount: totalAmount,
            totalContributors: totalContributors,
            goalAmount: campaign.goalAmount,
            progress: Math.round((totalAmount / campaign.goalAmount) * 100),
            status: campaign.status
        });
    } catch (error) {
        console.error("Error getting campaign total:", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    createContribution,
    getContributionsByCampaign,
    getContributionsByUser,
    getCampaignTotal
}; 