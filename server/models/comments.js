const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    user_id: String,
    constraint_id: String,
    content: String,
    comment_date: String,
    createdAt: Number,
    updatedAt: Number
}, {collection: 'comments'});

module.exports = mongoose.model('CommentsAttribute', commentsSchema)