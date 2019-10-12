const express       = require('express');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const passport      = require('passport');
const mongoose      = require('mongoose');
const redis         = require('redis');
const app           = express();

// Config
const config        = require('./api/config/config');

// Routes
const userRoutes    = require('./api/routes/users');

// Mongoose
mongoose.connect('mongodb://localhost/' + config.mongodbDatabase, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});
mongoose.Promise    = global.Promise;

// Redis
var redisClient     = redis.createClient();
redisClient.on('connect', () => {
    console.log('Redis client connected');
});
redisClient.on('error', (err) => {
    console.log('Redis client could not connect - ' + err);
});

// Global config parameters
app.set('apiSecretKey', config.apiSecretKey);
app.set('baseUrl', config.baseUrl);

// Logging all http requests
app.use(morgan('dev'));

// Body Parsers
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// PassportJs
require('./api/auth/passport');

// CORS Configuration
app.use((res, req, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }

    next();
});

// Routes which should handle requests
app.get('/', (req, res) => res.status(200).json('Welcome to Express API Boilerplate!'));
app.use('/users', userRoutes);

// Error handler for nout founded requests
app.use((req, res, next) => {
    const error     = new Error('Not found');
    error.status    = 404;
    next(error);
});

// Error handler for other errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
    
});

module.exports = app;