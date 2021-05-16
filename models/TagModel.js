const db = require("../db");
const { DataTypes } = require("sequelize");

module.exports = db.define("tags", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
