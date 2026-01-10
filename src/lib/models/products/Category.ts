import mongoose, { Schema, model, models } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String }, // Store Cloudinary URL or icon name
    emoji: { type: String }, // Emoji
    subcategories: [{ type: String }],
  },
  { timestamps: true }
);

export const Category = models.Category || model('Category', categorySchema);
