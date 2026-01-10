// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/dbConnect";

import { getServerSession } from "next-auth";

import { authOptions } from "../../auth/[...nextauth]/authOptions";
import Order from "@/lib/models/orders/order";
import { verifyAdmin } from "@/lib/auth/authGuard";

// GET /api/orders/[id]
export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    await dbConnect();
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ data: order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// app/api/orders/[id]/route.ts

interface UserData {
  email?: string;
  phone?: string;
  external_id?: string;
}



// ✅ Helper to send GA4 Purchase Event (Server-Side)
// ✅ Helper to send GA4 Purchase Event (Server-Side)
async function sendGA4PurchaseEvent(order: any) {
  console.log("📦 [GA4] Preparing to send purchase event for order:", order?.orderId);

  const totalValue =
    order.totalAmount ||
    order.items?.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    ) ||
    0;

  const payload = {
    client_id: order.clientId || `server-${Date.now()}`,
    user_agent: order.userAgent || "server",
    event_name: "purchase",
    event_time: Math.floor(Date.now() / 1000),
    ecommerce: {
      transaction_id: order.orderId,
      value: totalValue,
      currency: order.currency || "BDT",
      items:
        order.items?.map((item: any) => ({
          item_id: item.productId || item._id,
          item_name: item.productName,
          price: item.salePrice,
          quantity: item.quantity,
        })) || [],
    },
  };

  console.log("📤 [GA4] Sending payload to GTM server:", payload);

  try {
    const response = await fetch("https://babytoysbd.com/som/mp/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("🌐 [GA4] Server response status:", response.status);

    const responseText = await response.text();
    console.log("🧾 [GA4] Server response body:", responseText);
  } catch (error) {
    console.error("❌ [GA4] Failed to send purchase event:", error);
  }
}

interface paramsProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, context: paramsProps) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });


  try {
    await dbConnect();

    const updateData = await req.json();

    console.log(updateData,"UP");
    const { id } = await context.params;
    
    const existingOrder = await Order.findOne({ _id: id });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ Detect if status is changing to Confirmed
    const isStatusChangingToConfirmed =
      updateData.status === "confirmed" &&
      existingOrder.status !== "Confirmed";

    // ✅ Merge tracking history
    let mergedTrackingHistory = existingOrder.trackingHistory || [];
    if (Array.isArray(updateData.trackingHistory) && updateData.trackingHistory.length > 0) {
      const newTrack = updateData.trackingHistory.at(-1);
      mergedTrackingHistory.push(newTrack);
    }

    // ✅ Only update these 4 fields
    existingOrder.orderStatus = updateData.orderStatus ?? existingOrder.orderStatus;
    existingOrder.paymentStatus = updateData.paymentStatus ?? existingOrder.paymentStatus;
    existingOrder.priority = updateData.priority ?? existingOrder.priority;
    existingOrder.trackingHistory = mergedTrackingHistory;

    const updatedOrder = await existingOrder.save();

    // ✅ Send GA4 Purchase Event only when confirmed
    // if (isStatusChangingToConfirmed) {
    //   console.log("📊 Sending GA4 Purchase event for order:", updatedOrder.orderId);
    //   try {
    //     await sendGA4PurchaseEvent(updatedOrder);
    //     console.log("✅ GA4 Purchase event sent successfully");
    //   } catch (error) {
    //     console.error("❌ Failed to send GA4 Purchase event:", error);
    //   }
    // }

    return NextResponse.json(
      { message: "Order updated successfully", data: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Order Update Error]", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}



// DELETE /api/orders/[id]
export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const deletedOrder = await Order.findByIdAndDelete(params.id);

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
