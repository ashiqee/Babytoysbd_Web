import { dbConnect } from "@/lib/db/dbConnect";
import { Category } from "@/lib/models/products/Category";
import { NextResponse } from "next/server";


// POST /api/categories/check-slug
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const existing = await Category.findOne({ slug });
    return NextResponse.json({ exists: !!existing });
  } catch (error) {
    console.error("Slug check error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
