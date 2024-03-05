const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({

    text: {
        type: String,
        required: [true, 'comment text is required'],
    },

    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
    },
   
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    
    replies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Reply",
        }
    ],
    replyCount: Number,

    

}, { timestamps: true });

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;