const express = require('express');
const auth = require('../authentication/auth');
const router = express.Router();
const { getAllComments, createComment, getCommentById, updateComment, deleteComment } = require('../controllers/comment.controller');


// Get all comments
router.get('/post/:postId', getAllComments);

// Create a new comment
router.post('/', auth, createComment);

// Get a specific comment by ID
router.get('/:id', getCommentById);

// Update a comment 
router.put('/:id', auth, updateComment);

// Delete a comment
router.delete('/:id', auth, deleteComment);

module.exports = router;