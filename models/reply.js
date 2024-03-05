const mongoose = require('mongoose');

const replySchema = mongoose.Schema({

    text: {
        type: String,
        required: [true, 'reply text is required'],
    },

    comment: {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
    },
   
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    

}, { timestamps: true });

const Reply = new mongoose.model("Reply", replySchema);

module.exports = Reply;