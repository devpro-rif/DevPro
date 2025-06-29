const db = require('../database/index');
const Campaign = db.Campaign;
const Contribution = db.Contribution;

/**
 * Refresh all campaign statuses based on current amounts and deadlines
 * Useful for periodic maintenance or manual refresh
 */
const refreshAllCampaignStatuses = async () => {
    try {
        console.log('Starting refresh of all campaign statuses...');
        
        const campaigns = await Campaign.findAll();
        let updatedCount = 0;

        for (const campaign of campaigns) {
            const currentDate = new Date();
            const deadline = new Date(campaign.deadline);
            let newStatus = 'active';

            if (currentDate > deadline) {
                newStatus = 'expired';
            } else if (campaign.currentAmount >= campaign.goalAmount) {
                newStatus = 'completed';
            }

            // Only update if status needs to change
            if (newStatus !== campaign.status) {
                await campaign.update({ status: newStatus });
                console.log(`Campaign ${campaign.id} status updated: ${campaign.status} → ${newStatus}`);
                updatedCount++;
            }
        }

        console.log(`Campaign status refresh completed. ${updatedCount} campaigns updated.`);
        return { updatedCount, totalCampaigns: campaigns.length };
    } catch (error) {
        console.error('Error refreshing campaign statuses:', error);
        throw error;
    }
};

/**
 * Get campaign statistics
 */
const getCampaignStats = async (campaignId) => {
    try {
        const campaign = await Campaign.findByPk(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        const contributions = await Contribution.findAll({
            where: { CampaignId: campaignId }
        });

        const totalContributors = contributions.length;
        const progress = Math.round((campaign.currentAmount / campaign.goalAmount) * 100);
        const daysLeft = Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24));

        return {
            campaignId,
            title: campaign.title,
            goalAmount: campaign.goalAmount,
            currentAmount: campaign.currentAmount,
            progress,
            totalContributors,
            status: campaign.status,
            daysLeft: daysLeft > 0 ? daysLeft : 0,
            deadline: campaign.deadline,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt
        };
    } catch (error) {
        console.error('Error getting campaign stats:', error);
        throw error;
    }
};

module.exports = {
    refreshAllCampaignStatuses,
    getCampaignStats
}; 