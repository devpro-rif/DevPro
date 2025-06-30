module.exports = (sequelize, DataTypes) => {
  const CommunityInvitation = sequelize.define("CommunityInvitation", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined'),
      allowNull: false,
      defaultValue: 'pending'
    },
    invitedRole: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'contributor'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  });
  return CommunityInvitation;
}; 