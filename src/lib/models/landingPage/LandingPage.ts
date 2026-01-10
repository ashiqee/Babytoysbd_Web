// models/LandingPage.ts
import mongoose, { Schema } from 'mongoose';

const LandingPageSchema = new Schema(
  {
    name: String,
    blocks: Array, // store as array of objects (type, props, etc.)
  },
  { timestamps: true }
);

export const LandingPage =
  mongoose.models.LandingPage || mongoose.model('LandingPage', LandingPageSchema);
