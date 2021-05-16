const Sequelize = require("sequelize").Sequelize;

let sequelize = new Sequelize(process.env.DATABASE_URL);

module.exports = sequelize;
