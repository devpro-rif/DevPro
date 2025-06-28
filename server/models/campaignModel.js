module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define("Campaign", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    goalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  return Campaign;
};
