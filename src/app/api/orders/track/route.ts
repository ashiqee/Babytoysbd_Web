import { NextResponse } from "next/server";
import Order from "@/lib/models/orders/order";
import { dbConnect } from "@/lib/db/dbConnect";


export async function POST(req: Request) {
  try {
    await dbConnect(); // connect to DB

    const { orderId, contact } = await req.json();

    if (!orderId || !contact) {
      return NextResponse.json(
        { error: "Order ID and contact information are required" },
        { status: 400 }
      );
    }

   const normalizedContact = String(contact).trim();
const contactWithCode =
  normalizedContact.startsWith("+88") ? normalizedContact : `+88${normalizedContact}`;
const contactWithoutCode = normalizedContact.replace(/^\+88/, "");

// Query to match both versions
const order = await Order.findOne({
  orderId: String(orderId),
  $or: [
    { "customer.phone": contactWithCode },
    { "customer.phone": contactWithoutCode },
  ],
});
    

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or contact information does not match" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: order }, { status: 200 });
  } catch (error) {
    console.error("[ORDER_TRACK_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

// Optional: Handle unsupported methods gracefully
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
