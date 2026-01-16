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
} else {
  // Fallback to individual env vars
  sequelize = new Sequelize(
    process.env.DB_NAME,
    String(process.env.DB_USER),
    String(process.env.DB_PASSWORD),
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      logging: false,
    }
  );
}

module.exports = sequelize;
