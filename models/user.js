const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'name is required'],
        trim: true
    },
    email: {
        type: String, 
        required: [true, 'email is required'],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    phone: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String, 
    },
    shortBio: {
        type: String,
    },
    role: {
        type: String, 
        enum: ['admin', 'user'],
        default: 'user',
    },
    
    isBlocked:{
        type: Boolean,
        default: false,
    },

    blockedReason:{
        type: String, 
    },

    blockedAt: {
        type : Date,
    },

    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Post",
        }
    ],
    postsCount: Number,
    
    savedPosts: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Post",
        }
    ],
    
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        }
    ],
    replies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Reply",
        }
    ],

    
}, { timestamps: true });

const User = new mongoose.model("User", userSchema);

module.exports = User;