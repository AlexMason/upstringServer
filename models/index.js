const Users = require("./UserModel");
const Topics = require("./TopicModel");
const Comments = require("./CommentModel");
const Tags = require("./TagModel");
const Ratings = require("./RatingModel");
const TopicTags = require("./TopicTags");

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

Ratings.belongsTo(Topics, { constraints: false });
Ratings.belongsTo(Comments, { constraints: false });

Topics.hasMany(Ratings, { constraints: false });
Comments.hasMany(Ratings, { constraints: false });
Users.hasOne(Ratings);

Topics.belongsToMany(Tags, {
  through: TopicTags,
});
Tags.belongsToMany(Topics, {
  through: TopicTags,
});

TopicTags.belongsTo(Topics);
TopicTags.belongsTo(Tags);

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
  Ratings,
  TopicTags,
};
