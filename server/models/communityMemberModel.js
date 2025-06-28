module.exports = (sequelize, DataTypes) => {
  const CommunityMemberModel = sequelize.define("CommunityMemberModel", {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'member',
    }
  });
  return CommunityMemberModel;
};