const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true, 
        unique: true 
    },
    email: {
        type: String,
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId,  // references the post model
        ref: 'Post' 
    }],
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, // references the comment model
        ref: 'Comment' 
    }]
}, { timestamps: true });


userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);
