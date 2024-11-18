const app = require('./App');
const http = require('http');
require('dotenv').config();
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const server = http.createServer(app);

// connect to database
connectDB();

// Ensure the images directory exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Error handling for server
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Gracefully shutdown on unhandled rejections
    gracefulShutdown();
});

// Graceful shutdown handler
const gracefulShutdown = async () => {
    try {
        console.log('Received shutdown signal');
        await mongoose.connection.close();
        console.log('Database connection closed');
        
        await new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        console.log('Server closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', gracefulShutdown);

// Handle SIGTERM
process.on('SIGTERM', gracefulShutdown);

// Add error handling for database connection
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

