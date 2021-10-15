const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    type: String,
    text: String,
    end_date: String,
    duration: Number,
    project_id: String,
    plan_id: String,
    work_package_id: String,
    location_id: String,
    team_id: String,
    discipline_id: String,
    status_code: Number,
    crew_size: Number,
    wbs_code: String,
    progress: Number
}, { collection: 'tasks' });

module.exports = mongoose.model('Task', taskSchema);
