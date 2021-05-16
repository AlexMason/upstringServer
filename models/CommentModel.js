const db = require("../db");
const { DataTypes } = require("sequelize");

module.exports = db.define("comments", {
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stickied: {
    type: DataTypes.STRING,
    defaultValue: "none",
  },
});
