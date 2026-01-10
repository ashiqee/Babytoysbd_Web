import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  mobile_no?: string;
  address?: string;
  shippingAddress?: string;
  profilePic?: string;
  password: string;
  role: "admin" | "manager" | "customer";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    mobile_no: { type: String },
    address: { type: String },
    shippingAddress: { type: String },
    profilePic: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "customer"],
      default: "customer",
      required: true,
    },
  },
  { timestamps: true }
);

// Define indexes manually
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ mobile_no: 1 }, { unique: true, sparse: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
