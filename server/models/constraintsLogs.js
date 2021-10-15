const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constraintsHistorySchema = new Schema({
    constraint_id: String,
    from: Number,
    to: Number,
    user_id: String,
    createdAt: Number,
    updatedAt: Number
}, {collection: 'constraints_history'});

module.exports = mongoose.model('ConstraintsHistoryAttribute', constraintsHistorySchema);