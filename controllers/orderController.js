const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
    } = req.body;

    const orderExist = await Order.findOne({
        where: { paymentInfo }
    });

    if (orderExist) {
        return next(new ErrorHandler("Order Already Placed", 400));
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        paidAt: new Date(),
        user: req.user.id,
    });

    await sendEmail({
        email: req.user.email,
        templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
        data: {
            name: req.user.name,
            shippingInfo,
            orderItems,
            totalPrice,
            oid: order.id,
        }
    });

    res.status(201).json({
        success: true,
        order,
    });
});

// Get Single Order
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findByPk(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// Logged in user orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.findAll({
        where: { user: req.user.id }
    });

    res.status(200).json({
        success: true,
        orders,
    });
});

// Admin - all orders
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.findAll();

    let totalAmount = 0;
    orders.forEach(o => totalAmount += o.totalPrice);

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

// Update Order Status
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findByPk(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Already Delivered", 400));
    }

    if (req.body.status === "Shipped") {
        order.shippedAt = new Date();

        for (const i of order.orderItems) {
            const product = await Product.findByPk(i.product);
            product.stock -= i.quantity;
            await product.save();
        }
    }

    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
        success: true
    });
});

// Delete Order
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findByPk(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    await order.destroy();

    res.status(200).json({
        success: true,
    });
});
