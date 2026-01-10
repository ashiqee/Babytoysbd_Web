import { dbConnect } from "@/lib/db/dbConnect";
import { Product } from "@/lib/models/products/Product";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: {params: any }
) {
  await dbConnect();

  try {
    const data = await req.json(); // ✅ correctly parse request body
    const {productId,action }= data

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

   
 let updatedProduct;

    if (action === "add") {
      updatedProduct = await Product.findByIdAndUpdate(
       productId,
        { $inc: { wishlist: 1 } },
        { new: true }
      );
    } else if (action === "remove") {
      // ✅ Prevent wishlist from going below 0
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $inc: { wishlist: product.wishlist > 0 ? -1 : 0 } },
        { new: true }
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json({ error: "Error updating wishlist" }, { status: 500 });
  }
}
