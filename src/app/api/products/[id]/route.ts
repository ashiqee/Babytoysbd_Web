// /api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/dbConnect";
import { Product } from "@/lib/models/products/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { revalidateTag } from "next/cache";

interface paramsProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, context: paramsProps) {
  await dbConnect();

  try {
    const { id } = await context.params;
    const product = await Product.findById(id).select("-wholesalePrice");
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: paramsProps) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "manager"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    await dbConnect();
    const { id } = await context.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: paramsProps) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "manager"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await dbConnect();
    const { id } = await context.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
