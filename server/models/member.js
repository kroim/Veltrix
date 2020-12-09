const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    first_name: String,
    last_name: String,
    abrv: String,
    handle: String,
    email: String
}, { collection: 'members' });

module.exports = mongoose.model('Member', memberSchema);