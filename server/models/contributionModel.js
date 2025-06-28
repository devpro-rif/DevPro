module.exports = (sequelize, DataTypes) => {
  const Contribution = sequelize.define("Contribution", {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Contribution;
};
