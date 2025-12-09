import mongoose, { Schema, Model } from 'mongoose';

export interface IProject {
  title: string;
  description: string;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    ownerId: { type: String, required: true },
  },
  { timestamps: true }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;

