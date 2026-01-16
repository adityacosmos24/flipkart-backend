const path = require('path');
const express = require('express');
const cloudinary = require('cloudinary');
const app = require('./backend/app');
const sequelize = require('./backend/config/database');

// Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PostgreSQL connect (NO listen)
sequelize.sync()
    .then(() => {
        console.log("PostgreSQL connected");
    })
    .catch((err) => {
        console.log("DB connection failed:", err);
    });

// Deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

// ❗ VERY IMPORTANT FOR VERCEL
module.exports = app;
