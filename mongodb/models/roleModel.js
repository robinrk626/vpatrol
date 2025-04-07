const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('roles', RoleSchema, 'roles');
