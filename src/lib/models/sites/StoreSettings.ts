import mongoose, { Schema, model, models } from 'mongoose';

const StoreSettingsSchema = new Schema(
  {
    storeName: { type: String, required: true },
    storeEmail: { type: String, required: true },
    storePhone: { type: String, required: true },
    storeAddress: { type: String },
    logo: { type: String },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    customDomain: { type: String },

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    canonicalUrl: { type: String },

    // Socials & Tracking
    facebook: { type: String },
    instagram: { type: String },
    whatsapp: { type: String },
    googleAnalytics: { type: String },
    facebookPixel: { type: String },
    serverTracking: { type: Boolean, default: false },

  ogImage: { type: String },
  twitterHandle: { type: String },
  youtube: { type: String },
  pinterest: { type: String },
  googleSiteVerification: { type: String },
  bingSiteVerification: { type: String },
  yandexSiteVerification: { type: String },
  structuredData: { type: Object },
  robots: { type: String, default: "index, follow" },
  author: { type: String },
  language: { type: String, default: "en" },
  country: { type: String },
  region: { type: String }
  },
  { timestamps: true }
);

export const StoreSettings =
  models.StoreSettings || model('StoreSettings', StoreSettingsSchema);
