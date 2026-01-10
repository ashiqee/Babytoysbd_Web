// import mongoose, { Schema, Document, model } from 'mongoose';
// import slugify from 'slugify';
// // import AutoIncrementFactory from 'mongoose-sequence';  TODO NEED DELETE FROM 


// interface Attribute {
//   name: string;
//   value: any;
// }

// export interface IProduct extends Document {
//   productName: string;
//   productId?: string;
//   brandName?: string;
//   category?: string;
//   subCategory?: string;
//   regularPrice?: string;
//   salePrice?: string;
//   wholesalePrice?: string;
//   discount?: string;
//   sku?: string;
//   stockStatus?: string;
//   quantity?: number;
//   stockAlert?: number;
//   units?: string;
//   attributes?: Attribute[];
//   dimensions?: string;
//   weight?: string;
//   description?: string;
//   slug?: string;
//   metaTitle?: string;
//   metaDescription?: string;
//   keywords?: string[];
//   ogImage?: string;
//   canonicalUrl?: string;
//   status?: 'draft' | 'published';
//   images?: string[];
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const attributeSchema = new Schema<Attribute>({
//   name: String,
//   value: Schema.Types.Mixed,
// }, { _id: false });

// const productSchema = new Schema<IProduct>(
//   {
//     productName: { type: String, required: true },
//     productId: { type: String, unique: true, index: true },
//     brandName: String,
//     category: String,
//     subCategory: String,
//     regularPrice: String,
//     salePrice: String,
//     discount: String,
//     sku: String,
//     stockStatus: String,
//     quantity: Number,
//     stockAlert: Number,
//     units: String,
//     attributes: [attributeSchema],
//     dimensions: String,
//     weight: String,
//     description: String,
//     slug: { type: String, unique: true, index: true },
//     metaTitle: String,
//     metaDescription: String,
//     keywords: [String],
//     ogImage: String,
//     canonicalUrl: String,
//     status: {
//       type: String,
//       enum: ['draft', 'published'],
//       default: 'published',
//     },
//     images: [String],
//   },
//   { timestamps: true }
// );



// // ✅ Pre-save middleware
// productSchema.pre('validate', function (next) {
//   const doc = this as IProduct;

//   if (!doc.slug && doc.productName) {
//     doc.slug = slugify(doc.productName, { lower: true, strict: true });
//   }

//   if (!doc.metaTitle && doc.productName) {
//     doc.metaTitle = `${doc.productName} | BabyToysBD`;
//   }

//   if (!doc.metaDescription && doc.productName) {
//     doc.metaDescription = `Buy ${doc.productName} at the best price in Bangladesh. Fast delivery from BabyToysBD.`;
//   }

//   if (!doc.ogImage && doc.images?.length) {
//     doc.ogImage = doc.images[0];
//   }

//   next();
// });


// export const Product = mongoose.models.Product || model<IProduct>('Product', productSchema);
