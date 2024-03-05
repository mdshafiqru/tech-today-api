const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'title is required'],
    },
    description: {
        type: String,
        required: [true, 'description is required'],
    },
    isDeleted:{
        type: Boolean,
        default: false,
    },
    thumbnail : {
        type: String,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    images: [
        {
            type: String
        }
    ],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        }
    ],
    isLiked: Boolean,
    likeCount: Number,
    commentCount: Number,


}, { timestamps: true }); //toJSON: { virtuals: true }



const Post = new mongoose.model("Post", postSchema);

module.exports = Post;