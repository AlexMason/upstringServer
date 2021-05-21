const db = require("../db");
const { DataTypes } = require("sequelize");

module.exports = db.define("users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    //ROLES: 0: user, 1: moderator, 2: admin
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
