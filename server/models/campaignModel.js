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
