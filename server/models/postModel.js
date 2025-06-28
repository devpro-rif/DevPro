module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  return Post;
};