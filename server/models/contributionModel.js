module.exports = (sequelize, DataTypes) => {
  const Contribution = sequelize.define("Contribution", {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  // Hook to update campaign currentAmount and status after contribution is created
  Contribution.afterCreate(async (contribution, options) => {
    console.log("DEBUG: Contribution created, updating campaign", contribution.toJSON());

    const campaignId = contribution.CampaignId;
    
    if (!campaignId) {
      console.error("CampaignId is undefined. Did you pass CampaignId in the .create call?");
      return;
    }

    try {
      // Get the campaign
      const Campaign = contribution.sequelize.models.Campaign;
      const campaign = await Campaign.findByPk(campaignId, { transaction: options.transaction });
      
      if (!campaign) {
        console.error("Campaign not found with ID:", campaignId);
        return;
      }

      // Calculate new current amount
      const allContributions = await Contribution.findAll({
        where: { CampaignId: campaignId },
        transaction: options.transaction
      });

      const newCurrentAmount = allContributions.reduce((sum, contrib) => sum + contrib.amount, 0);

      // Determine new status
      const currentDate = new Date();
      const deadline = new Date(campaign.deadline);
      let newStatus = 'active';

      if (currentDate > deadline) {
        newStatus = 'expired';
      } else if (newCurrentAmount >= campaign.goalAmount) {
        newStatus = 'completed';
      }

      // Update campaign
      await Campaign.update(
        { 
          currentAmount: newCurrentAmount,
          status: newStatus
        },
        { 
          where: { id: campaignId }, 
          transaction: options.transaction 
        }
      );

      console.log(`Campaign ${campaignId} updated: currentAmount=${newCurrentAmount}, status=${newStatus}`);
    } catch (error) {
      console.error("Error updating campaign after contribution creation:", error);
      throw error;
    }
  });

  return Contribution;
};
