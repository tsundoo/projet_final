const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String 
    },
    content: { 
        type: String, 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId,  // references the user model
        ref: 'User', 
        required: true 
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId,  // references the comment model
        ref: 'Comment' 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
