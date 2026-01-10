import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IShipping extends Document {
  shippingId: string;
  orderId: string;
  customer: string;
  carrier: string;
  trackingNumber: string;
  status: 'Pending' | 'Shipped' | 'In Transit' | 'Delivered' | 'Canceled';
  shippedDate: string;
}

const shippingSchema = new Schema<IShipping>(
  {
    shippingId: { type: String, required: true },
    orderId: { type: String, required: true },
    customer: { type: String, required: true },
    carrier: { type: String, required: true },
    trackingNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'In Transit', 'Delivered', 'Canceled'],
      default: 'Pending',
    },
    shippedDate: { type: String, required: true },
  },
  { timestamps: true }
);

export const Shipping =
  models.Shipping || model<IShipping>('Shipping', shippingSchema);
