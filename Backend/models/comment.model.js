const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId,  // references the user model
        ref: 'User', 
        required: true 
    },
    post: { 
        type: mongoose.Schema.Types.ObjectId,  // references the post model
        ref: 'Post', 
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);