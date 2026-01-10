// lib/services/product.service.ts

import { dbConnect } from "@/lib/db/dbConnect";
import { Product } from "@/lib/models/products/Product";


export async function getProductById(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id);

    if (!product) return null;

    return product.toObject(); // Optional: plain JS object
  } catch (err) {
    console.error("Error in getProductById:", err);
    throw new Error("Failed to fetch product");
  }
}
