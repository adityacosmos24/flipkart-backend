const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  // For Render or other providers that give DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}
module.exports = sequelize;
