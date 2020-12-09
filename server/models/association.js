const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const associationSchema = new Schema({
    team_id: String,
    member_id: String,
    role: String
}, { collection: 'associations' });

module.exports = mongoose.model('Association', associationSchema);