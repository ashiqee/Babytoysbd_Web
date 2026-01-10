// models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define interface for Facebook CAPI data
interface FacebookData {
  fbp?: string;      // Facebook browser ID
  fbc?: string;      // Facebook click ID
  userAgent?: string; // Browser user agent
  clientIP?: string;  // Client IP address
}

// Define interface for customer data
interface CustomerData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string; // Your system's customer ID
}

// Define the Order document interface
interface IOrder extends Document {
  orderId: string;
  customer: CustomerData;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    category?: string;
  }>;
  totalAmount: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  priority?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  mobileNumber?: string;
  deliveryCompany?: string;
  deliveryTrackingNo?: string;
  shippingCost?: number;
  trackingHistory?: Array<{
    status: string;
    timestamp: Date;
    note?: string;
  }>;
  facebookData: FacebookData; // Added Facebook CAPI data
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const OrderSchema = new Schema<IOrder>({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    externalId: {
      type: String,
      trim: true,
    },
  },
  items: [{
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'BDT',
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Packaging','Processing', 'Shipping', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded','unpaid'],
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High',`Normal`],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  mobileNumber: String,
  deliveryCompany: String,
  deliveryTrackingNo: String,
  shippingCost: {
    type:Number,
    default: 0
  },
  trackingHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: String,
  }],
  // Added Facebook CAPI data fields
  facebookData: {
    fbp: String,      // Facebook browser ID
    fbc: String,      // Facebook click ID
    userAgent: String, // Browser user agent
    clientIP: String,  // Client IP address
  },
}, {
  timestamps: true,
});

// Create and export the model
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;