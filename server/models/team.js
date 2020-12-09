const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: String,
    abrv: String,
    handle: String,
    planning: String
}, { collection: 'teams' });

module.exports = mongoose.model('Team', teamSchema);