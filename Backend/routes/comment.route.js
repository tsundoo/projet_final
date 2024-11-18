const express = require('express');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const auth = require('../authentication/auth');
const router = express.Router();


// Get all comments
router.get('/post/:postId', async (req, res) => {   
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username _id')
            .sort({ createdAt: -1 });
            res.json(comments);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Create a new comment
router.post('/', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.body.post);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const comment = new Comment({
            content: req.body.content,
            author: req.user._id,
            post: req.body.post
        });

        await comment.save();
        
        // Add console.log to verify comment was saved
        console.log('Saved comment:', comment);

        post.comments.push(comment._id);
        await post.save();
        
        // Populate author details before sending response
        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'username _id email')
            .lean();
        // Add console.log to verify populated data
        console.log('Sending populated comment:', populatedComment);
        
        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(400).send({ message: error.message });
    }
});

// Get a specific comment by ID
router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('author', 'username');
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        res.send(comment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Update a comment 
router.put('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        Object.assign(comment, req.body);
        await comment.save();
        res.send(comment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        
        // Remove comment from post's comments array
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id }
        });
        
        await Comment.deleteOne({ _id: comment._id });
        res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;