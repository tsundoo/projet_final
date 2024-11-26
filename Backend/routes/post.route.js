const express = require('express');
const auth = require('../authentication/auth');
const multer = require('../config/multer');
const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/post.controller');

// Create a new post
router.post('/', auth, multer, createPost);

// Get all posts
router.get('/', getAllPosts);

// Get a single post by ID
router.get('/:id', getPostById);

// Update a post
router.put('/:id', auth, multer, updatePost);

// Delete a post 
router.delete('/:id', auth, deletePost);

module.exports = router;
