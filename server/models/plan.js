const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    project_id: String,
    name: String,
    description: String,
    created_by_id: String,
    teams: String,
    packages: String,
    locations: String,
    is_locked: Boolean
}, { collection: 'plans' });

module.exports = mongoose.model('Plan', planSchema);
