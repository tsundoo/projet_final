const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../App');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Option 1: Increase timeout for entire test suite
jest.setTimeout(30000);

// Mock auth middleware
jest.mock('../authentication/auth', () => {
    return (req, res, next) => {
        req.user = {
            _id: '507f1f77bcf86cd799439011',
            username: 'testuser'
        };
        next();
    };
});

// Mock multer middleware
jest.mock('../config/multer', () => {
    return (req, res, next) => {
        req.file = {
            filename: 'test-image.jpg'
        };
        next();
    };
});

// Mock fs.unlink
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    unlink: jest.fn((path, callback) => callback(null))
}));

describe('Post API Tests', () => {
    let testUser;
    let testPost;

    beforeAll(async () => {
        try {
            // Connect to test database with explicit options
            await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blog-test', {
                serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
                connectTimeoutMS: 10000,
            });
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }, 60000); // Increased timeout to 60s

    beforeEach(async () => {
        // Clear database and create test user
        await Post.deleteMany({});
        await User.deleteMany({});

        testUser = new User({
            _id: '507f1f77bcf86cd799439011',
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123'
        });
        await testUser.save();

        testPost = {
            title: 'Test Post',
            content: 'Test Content',
            author: testUser._id
        };
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/posts', () => {
        it('should create a new post', async () => {
            const response = await request(app)
                .post('/api/posts')
                .send({
                    title: testPost.title,
                    content: testPost.content,
                    author: testPost.author.toString()
                })
                .attach('image', Buffer.from('fake-image'), 'test-image.jpg');

            console.log('Response:', response.body);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(testPost.title);
            expect(response.body.content).toBe(testPost.content);
            expect(response.body.image).toBe('/images/test-image.jpg');
            expect(response.body.author.username).toBe('testuser');
        });
    });

    describe('GET /api/posts', () => {
        it('should get all posts', async () => {
            const post = new Post({
                ...testPost,
                image: '/images/test-image.jpg'
            });
            await post.save();

            const response = await request(app).get('/api/posts');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(1);
            expect(response.body[0].title).toBe(testPost.title);
        });
    });

    describe('GET /api/posts/:id', () => {
        it('should get post by id', async () => {
            const post = new Post({
                ...testPost,
                image: '/images/test-image.jpg'
            });
            await post.save();

            const response = await request(app).get(`/api/posts/${post._id}`);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(testPost.title);
        });

        it('should return 404 if post not found', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/posts/${fakeId}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/posts/:id', () => {
        it('should update post', async () => {
            const post = new Post({
                ...testPost,
                image: '/images/test-image.jpg'
            });
            await post.save();

            const updatedData = {
                title: 'Updated Title',
                content: 'Updated Content'
            };

            const response = await request(app)
                .put(`/api/posts/${post._id}`)
                .send(updatedData)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedData.title);
            expect(response.body.content).toBe(updatedData.content);
            expect(response.body.image).toBe('/images/test-image.jpg');
        });
    });

    describe('DELETE /api/posts/:id', () => {
        it('should delete post', async () => {
            const post = new Post({
                ...testPost,
                image: '/images/test-image.jpg'
            });
            await post.save();

            const response = await request(app).delete(`/api/posts/${post._id}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Post deleted successfully');

            const deletedPost = await Post.findById(post._id);
            expect(deletedPost).toBeNull();
        });
    });
});
