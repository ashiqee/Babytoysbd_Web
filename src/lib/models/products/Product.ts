// models/Product.ts
import mongoose, { Schema, Document, model } from 'mongoose';
import slugify from 'slugify';

interface Attribute {
  name: string;
  value: any;
}
interface TagsAttribute {
  name: string;
  slug: string;
}

interface Variation {
  _id?: mongoose.Types.ObjectId;
  attributes: Attribute[];
  regularPrice?: string;
  salePrice?: string;
  sku?: string;
  image?: string;
  quantity?: number;
}

export interface IProduct extends Document {
  productName: string;
  productId?: string;
  brandName?: string;
  category?: string;
  tags?: TagsAttribute[];
  subCategory?: string;
  regularPrice?: string;
  salePrice?: string;
  wholesalePrice?: string;
  discount?: string;
  sku?: string;
  stockStatus?: "In Stock" | "out_of_stock" |"backorder";
  quantity?: number;
  stockAlert?: number;
  wishlist?: number;
  units?: string;
  variations?: Variation[]; // Changed from attributes to variations
  dimensions?: string;
  weight?: string;
  description?: string;
  sortDescription?: string;
  rating?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  status?: 'draft' | 'published';
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const attributeSchema = new Schema<Attribute>({
  name: String,
  value: Schema.Types.Mixed,
}, { _id: false });

const tagsSchema = new Schema<TagsAttribute>({
  name: String,
  slug: String,
}, { _id: false });

const variationSchema = new Schema<Variation>({
  attributes: [attributeSchema],
  regularPrice: String,
  salePrice: String,
  sku: String,
  image: String,
  quantity: Number,
}, { _id: true });

const productSchema = new Schema<IProduct>(
  {
    productName: { type: String, required: true },
    productId: { type: String, unique: true, index: true },
    brandName: String,
    category: String,
    tags: [tagsSchema],
    subCategory: String,
    regularPrice: String,
    salePrice: String,
    wholesalePrice: String,
    discount: String,
    sku: String,
    stockStatus: String,
    wishlist: Number,
    quantity: Number,
    stockAlert: Number,
    units: String,
    variations: [variationSchema], // Changed from attributes to variations
    dimensions: String,
    weight: String,
    description: String,
    sortDescription:String,
    slug: { type: String, unique: true, index: true },
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
    canonicalUrl: String,
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    images: [String],
  },
  { timestamps: true }
);

// Pre-save middleware remains the same
productSchema.pre('validate', async function () {
  const doc = this as IProduct;

  if (!doc.slug && doc.productName) {
    doc.slug = slugify(doc.productName, { lower: true, strict: true });
  }

  if (!doc.metaTitle && doc.productName) {
    doc.metaTitle = `${doc.productName} | BabyToysBD`;
  }

  if (!doc.metaDescription && doc.productName) {
    doc.metaDescription = `Buy ${doc.productName} at the best price in Bangladesh. Fast delivery from BabyToysBD.`;
  }

  if (!doc.ogImage && doc.images?.length) {
    doc.ogImage = doc.images[0];
  }

  // Auto-generate SKU only for new products
  if (this.isNew && !this.sku) {
    const lastProduct = await mongoose.models.Product
      .findOne({})
      .sort({ createdAt: -1 })
      .select('sku');

    let nextNumber = 1;

    if (lastProduct?.sku) {
      const lastNum = parseInt(lastProduct.sku.replace('SKU-', ''), 10);
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    this.sku = `SKU-${String(nextNumber).padStart(4, '0')}`;
  }
});


export const Product = mongoose.models.Product || model<IProduct>('Product', productSchema);