const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    id: String,
    type: String,
    text: String,
    date: String,
    duration: Number,
    parent: String,
    project_id: String,
    plan_id: String,
    work_package_id: String,
    location_id: String,
    team_id: String,
    discipline_id: String,
    status_code: Number,
    crew_size: Number,
    wbs_code: String,
    metadata: String,
    progress: Number
}, { collection: 'tasks' });

module.exports = mongoose.model('Task', taskSchema);
