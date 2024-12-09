const express = require('express');
const path = require('path');
const app = express();
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
const commentRoute = require('./routes/comment.route');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Your React app URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    crossOriginResourcePolicy: {
        policy: 'cross-origin'
    }
}));
app.use(morgan('dev'));

// routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: status
        }
    });
});

module.exports = app;
