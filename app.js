const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error');

const app = express();

// CORS CONFIG
app.use(cors({
  origin: [
    "https://flipkart-3ran.vercel.app"
  ],
  credentials: true,
}));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'config/config.env' });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');

app.use('/api/v1', product);
app.use('/api/v1', order);

// Error middleware
app.use(errorMiddleware);

module.exports = app;
