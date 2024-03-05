const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, 'category name is required'],
    },

    postCount: Number,

    isActive:{
        type: Boolean,
        default: true,
    },

    

}, { timestamps: false });

const Category = new mongoose.model("Category", categorySchema);

module.exports = Category;