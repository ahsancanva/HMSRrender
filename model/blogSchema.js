const mongoose = require('mongoose');
const validator = require('validator');

const blogSchema = new mongoose.Schema({

    image: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    date:{
        type: Date,
        default: new Date().toDateString()
    },
    blog: {
        type: Number,
    }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;