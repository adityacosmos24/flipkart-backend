const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    highlights: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    specifications: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cuttedPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    brand: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    warranty: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    ratings: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    numOfReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    reviews: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Product;
