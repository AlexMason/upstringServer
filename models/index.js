const Users = require("./UserModel");
const Topics = require("./TopicModel");
const Comments = require("./CommentModel");
const Tags = require("./TagModel");

Users.hasMany(Topics, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});
Users.hasMany(Comments, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

Topics.belongsTo(Users, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});
Topics.hasMany(Comments, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

Topics.belongsToMany(Tags, {
  through: "TopicTags",
});
Tags.belongsToMany(Topics, {
  through: "TopicTags",
});

Comments.belongsTo(Users, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});
Comments.belongsTo(Topics, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

module.exports = {
  Users,
  Topics,
  Comments,
  Tags,
};
