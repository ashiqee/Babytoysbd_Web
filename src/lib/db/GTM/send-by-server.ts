"use client"; // ✅ Must be client — because localStorage & fetch to GTM Server are browser-side

// lib/gtm.ts
const GTM_SERVER_URL = "https://babytoysbd.com/som/g/collect";

/**
 * ✅ Get or generate a stable client ID (required for GA4 Measurement Protocol)
 */
function getClientId(): string {
  if (typeof window === "undefined") {
    return crypto.randomUUID();
  }

  let cid = localStorage.getItem("ga_client_id");
  if (!cid) {
    cid = crypto.randomUUID();
    localStorage.setItem("ga_client_id", cid);
  }
  return cid;
}

/**
 * 🔸 Send event to GTM Server
 */
async function sendServerEvent(
  eventName: string,
  params: Record<string, any> = {}
): Promise<void> {
  try {
    const payload = {
      client_id: getClientId(),
      non_personalized_ads: false,
      events: [
        {
          name: eventName,
          params,
        },
      ],
    };

    const response = await fetch(GTM_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
      mode: "cors",
      credentials: "omit", // ✅ GTM server usually doesn't need credentials
    });

    console.log("✅ GTM Server Response Status:", response.status);
    const resultText = await response.text();
    console.log("📦 GTM Server Result:", resultText);

    if (!response.ok) {
      console.error("❌ GTM Server returned error:", response.status, resultText);
    }
  } catch (error) {
    console.error("❌ GTM Server send error:", error);
  }
}

/**
 * 📄 Page View
 */
export function trackPageViewGTMS(url: string): void {
  sendServerEvent("page_view", {
    page_location: url,
    page_title: document.title,
  });
}

/**
 * 👀 Product View
 */
export function trackViewItemGTMS(product: any): void {
  sendServerEvent("view_item", {
    currency: "BDT",
    value: product.price,
    items: [
      {
        item_id: product._id,
        item_name: product.productName,
        price: product.price,
        item_category: product.category,
      },
    ],
  });
}

/**
 * 🛒 Add to Cart
 */
export function trackAddToCartGTMS(product: any): void {
  sendServerEvent("add_to_cart", {
    currency: "BDT",
    value: product.salePrice,
    items: [
      {
        item_id: product._id,
        item_name: product.productName,
        price: product.salePrice,
        quantity: 1,
      },
    ],
  });
}

/**
 * 🧾 Begin Checkout
 */
export function trackBeginCheckoutGTMS(cart: any[]): void {
  sendServerEvent("begin_checkout", {
    currency: "BDT",
    value: cart.reduce((sum, i) => sum + i.salePrice * i.quantity, 0),
    items: cart.map((i) => ({
      item_id: i._id,
      item_name: i.productName,
      price: i.salePrice,
      quantity: i.quantity,
    })),
  });
}

/**
 * 💳 Purchase
 */
export function trackPurchaseGTMS(order: any): void {
  sendServerEvent("purchase", {
    transaction_id: order.orderId,
    value: order.totalAmount,
    currency: "BDT",
    items: order.products.map((p: any) => ({
      item_id: p.productId,
      item_name: p.productName,
      price: p.salePrice,
      quantity: p.quantity,
    })),
  });
}
