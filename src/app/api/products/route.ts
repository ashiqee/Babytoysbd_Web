import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { dbConnect } from "@/lib/db/dbConnect";
import { Product } from "@/lib/models/products/Product";
import { authOptions } from "../auth/[...nextauth]/authOptions";


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !["admin", "manager"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await req.json();
    await dbConnect();

   const lastProduct = await Product.findOne({})
  .sort({ createdAt: -1 })
  .select("productId")
  .lean<{ productId?: string } | null>();

let nextId = 1;

if (lastProduct?.productId) {
  const lastNumber = parseInt(lastProduct.productId.replace("PRD-", ""));
  if (!isNaN(lastNumber)) {
    nextId = lastNumber + 1;
  }
}

data.productId = `PRD-${String(nextId).padStart(4, "0")}`;

    const newProduct = new Product(data);
    await newProduct.save();

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Product POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get all products
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 }); // newest first
    return NextResponse.json(products);
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}