const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constraintsSchema = new Schema({
    constraint: String,
    initiated_by: String,
    team: String,
    work_packages: String,
    check_list: String,
    checked_list: String,
    status: Number,
    createdAt: Number,
    updatedAt: Number
}, {collection: 'constraints'});
module.exports = mongoose.model('ConstraintsAttribute', constraintsSchema);