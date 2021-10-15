const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sysInfoSchema = new Schema({
    key: String,
    value: String
}, { collection: 'sys_infos' });

module.exports = mongoose.model('SysInfo', sysInfoSchema);
