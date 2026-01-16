const Product = require('../models/productModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

// Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {

    const products = await Product.findAll();
    const productsCount = products.length;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage: 12,
        filteredProductsCount: productsCount,
    });
});

// Get Products (Sliders)
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.findAll();

    res.status(200).json({
        success: true,
        products,
    });
});

// Get Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Get Admin Products
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.findAll();

    res.status(200).json({
        success: true,
        products,
    });
});

// Create Product
exports.createProduct = asyncErrorHandler(async (req, res, next) => {

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    const brandUpload = await cloudinary.v2.uploader.upload(req.body.logo, {
        folder: "brands",
    });

    const brand = {
        name: req.body.brandname,
        logo: {
            public_id: brandUpload.public_id,
            url: brandUpload.secure_url,
        }
    };

    let specs = [];
    req.body.specifications.forEach((s) => {
        specs.push(JSON.parse(s));
    });

    const product = await Product.create({
        ...req.body,
        images: imagesLink,
        brand,
        specifications: specs,
        user: req.user.id,
    });

    res.status(201).json({
        success: true,
        product
    });
});

// Update Product
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    let imagesLink = product.images;

    if (req.body.images !== undefined) {
        imagesLink = [];

        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        let images = [];
        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
    }

    let brand = product.brand;
    if (req.body.logo && req.body.logo.length > 0) {
        await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);

        const brandUpload = await cloudinary.v2.uploader.upload(req.body.logo, {
            folder: "brands",
        });

        brand = {
            name: req.body.brandname,
            logo: {
                public_id: brandUpload.public_id,
                url: brandUpload.secure_url,
            }
        };
    }

    let specs = [];
    req.body.specifications.forEach((s) => {
        specs.push(JSON.parse(s));
    });

    await product.update({
        ...req.body,
        images: imagesLink,
        brand,
        specifications: specs,
        user: req.user.id,
    });

    res.status(200).json({
        success: true,
        product
    });
});

// Delete Product
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.destroy();

    res.status(200).json({
        success: true
    });
});
