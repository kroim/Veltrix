const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reasonCodesSchema = new Schema({
    ref_id: String,
    reason: String,
    description: String,
}, {collection: 'reason_codes'});

module.exports = mongoose.model('ReasonCodesAttribute', reasonCodesSchema);