const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectAttributeSchema = new Schema({
    attribute_name: String,
    tag_name: String,
    handle: String
}, { collection: 'project_attributes' });

module.exports = mongoose.model('ProjectAttribute', projectAttributeSchema);