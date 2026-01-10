import mongoose, { Schema, model, models } from 'mongoose';

const tagsSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    },
  { timestamps: true }
);

export const Tags = models.Tags || model('Tags', tagsSchema);
