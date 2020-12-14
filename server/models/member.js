const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    first_name: String,
    last_name: String,
    abrv: String,
    handle: String,
    email: String,
    is_registered: Boolean
}, { collection: 'members' });

module.exports = mongoose.model('Member', memberSchema);