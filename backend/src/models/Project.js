const { Schema, model } = require('mongoose');

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    ownerId: { type: String, required: true }, // Clerk user id who created the project
  },
  { timestamps: true }
);

module.exports = model('Project', ProjectSchema);
