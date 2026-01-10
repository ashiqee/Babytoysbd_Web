// pages/api/products/wishlist.ts
import { dbConnect } from '@/lib/db/dbConnect';
import { Product } from '@/lib/models/products/Product';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  await dbConnect();
  
  try {
    const { productIds } = await req.json();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "Invalid product IDs" }, { status: 400 });
    }
    
    const products = await Product.find({ _id: { $in: productIds } });
    
    if (!products || products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching wishlist products:', error);
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}


