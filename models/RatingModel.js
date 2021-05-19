const db = require("../db");
const { DataTypes } = require("sequelize");

module.exports = db.define("ratings", {
  positive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});
