import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/authGuard";
import { dbConnect } from "@/lib/db/dbConnect";
import Order from "@/lib/models/orders/order";

export async function GET(req: NextRequest) {
  // 🔐 Check Web or Mobile Admin
  const auth = await verifyAdmin(req);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  return await fetchOrders();
}

// 🔥 Shared DB Query Function
async function fetchOrders() {
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
