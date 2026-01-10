"use client";

import { useEffect } from "react";

interface GA4ViewContentProps {
  slug: string;
  productId: string;
  productName: string;
  category: string;
  price: number;
}

export default function GA4ViewContent({
  slug,
  productId,
  productName,
  price,
  category
}: GA4ViewContentProps) {
  useEffect(() => {
    const eventId = `${productId}-${Date.now()}`;

    // 1️⃣ Client-side GA4 event (via dataLayer for GTM)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        items: [
          {
            item_id: productId,
            item_name: productName,
            price: price,
            item_category: category,  // ✅ Fixed: Use 'item_category' per GA4 schema
          },
        ],
        // ✅ Optional: Add value/currency here if tracking total (move inside params for consistency)
        value: price,
        currency: "BDT",
      },
    });

    // 2️⃣ Server-side event (GA4 MP batch format for sGTM)
    const mpPayload = {
      client_id: getClientId(),
      events: [  // ✅ Wrap in 'events' array
        {
          name: "view_item",  // ✅ Use 'name' inside event object
          params: {  // ✅ Nest ecommerce, event_id, etc. in 'params'
            ecommerce: {
              items: [
                {
                  item_id: productId,
                  item_name: productName,
                  price: price,
                  item_category: category,  // ✅ Consistent schema
                },
              ],
              value: price,
              currency: "BDT",
            },
            event_id: eventId,  // ✅ Dedup ID
            // ✅ event_time optional (GA4 auto-adds); add if needed for custom timing
          },
        },
      ],
    };

    fetch("https://babytoysbd.com/som/mp/collect?measurement_id=G-TWXQPLVXS1", {  // ✅ Add measurement_id query param
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent,  // ✅ Forward via header (not body)
      },
      body: JSON.stringify(mpPayload),
    }).catch((error) => {  // ✅ Add error handling
      console.error("Server-side tracking failed:", error);
    });
  }, [productId, productName, price, category]);  // ✅ Remove unused 'slug' from deps

  return null;
}

// Helper to get GA4 client_id from gtag cookies (_ga) - unchanged, correct
function getClientId() {
  try {
    const gaCookie = document.cookie.split("; ").find((row) => row.startsWith("_ga="));
    if (!gaCookie) return "unknown";
    const clientId = gaCookie.split(".").slice(-2).join(".");
    return clientId;
  } catch (err) {
    return "unknown";
  }
}