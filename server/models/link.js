const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    id: String,
    type: String,
    source: String,
    target: String
}, { collection: 'links' });

module.exports = mongoose.model('Link', linkSchema);
