const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
    shippingInfo: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    orderItems: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    paymentInfo: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    paidAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    orderStatus: {
        type: DataTypes.STRING,
        defaultValue: "Processing",
    },
    deliveredAt: DataTypes.DATE,
    shippedAt: DataTypes.DATE,
}, {
    timestamps: true,
});

module.exports = Order;
