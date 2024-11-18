const express = require('express');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post.model');
const auth = require('../authentication/auth');
const multer = require('../config/multer');
const router = express.Router();

// Create a new post
router.post('/', auth, multer, async (req, res) => {
    try {
        console.log('User:', req.user); 
        if (!req.file) {
            return res.status(400).send({ message: 'No image file uploaded' });
        }
        const post = new Post({
            ...req.body,
            author: req.user._id,
            image: `/images/${req.file.filename}`
        });
        await post.save();
        await post.populate('author', 'username');
        res.status(201).send(post);
    } catch (error) {
        console.error('Error creating post:', error); 
        res.status(400).send({ message: error.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.send(posts);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).send({ message: 'Post not found' });
        res.send(post);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }    
});

// Update a post
router.put('/:id', auth, multer, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found' });
        if (post.author.toString() !== req.user._id.toString()) return res.status(403).send({ message: 'Unauthorized' });

        const oldImagePath = post.image;

        Object.assign(post, req.body);
        if (req.file) {
            post.image = `/images/${req.file.filename}`;
            // Delete the old image if it exists and is different from the new image
            if (oldImagePath && oldImagePath !== post.image) {
                await deleteImageFile(oldImagePath);
            } 
        }

        await post.save();
        await post.populate('author', 'username');
        res.send(post);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Delete a post 
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found' });
        if (post.author.toString() !== req.user._id.toString()) return res.status(403).send({ message: 'Unauthorized' });

        // Delete the image file from the server
        if(post.image) {
            await deleteImageFile(post.image);
        }

        await post.deleteOne();
        res.send({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});


// Helper function to delete image file from server
function deleteImageFile(imagePath) {
    return new Promise((resolve, reject) => {
        if (imagePath) {
            const fullPath = path.join(__dirname, '..', imagePath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                    reject(err);
                } else {
                    console.log('Image deleted successfully');
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}



module.exports = router;
