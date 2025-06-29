module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define("Campaign", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    objective: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    goalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'expired', 'cancelled'),
      allowNull: false,
      defaultValue: 'active',
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline : {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Hook to update campaign status when deadline or goal amount changes
  Campaign.afterUpdate(async (campaign, options) => {
    const changedFields = campaign.changed();
    
    // Only update status if deadline or goalAmount changed
    if (changedFields && (changedFields.includes('deadline') || changedFields.includes('goalAmount'))) {
      console.log("DEBUG: Campaign deadline or goal amount changed, updating status", campaign.toJSON());

      try {
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
          await Campaign.update(
            { status: newStatus },
            { 
              where: { id: campaign.id }, 
              transaction: options.transaction 
            }
          );
          console.log(`Campaign ${campaign.id} status updated to: ${newStatus}`);
        }
      } catch (error) {
        console.error("Error updating campaign status after deadline/goal change:", error);
        throw error;
      }
    }
  });

  return Campaign;
};
