// lib/gtm.ts
interface GTMEvent {
  event: string;
  [key: string]: any;
}

// Client-side: Push to GTM dataLayer (unchanged)
export const pushToDataLayer = (event: GTMEvent) => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
};

// Client-side: Page view (unchanged)
export const trackPageView = (url: string) => {
  pushToDataLayer({
    event: "page_view",
    page_location: url,
  });
};

// Client-side: Product view (unchanged)
export const trackViewItem = (product: any) => {
  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: "BDT",
      value: product.price,
      items: [
        {
          item_id: product._id,
          item_name: product.productName,
          price: product.price,
          category: product.category,
        },
      ],
    },
  });
};

// Client-side: Add to cart (unchanged)
export const trackAddToCart = (product: any) => {
  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
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
    },
  });
};

// Client-side: Begin checkout (unchanged)
export const trackBeginCheckout = (cart: any[]) => {
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency: "BDT",
      value: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      items: cart.map((i) => ({
        item_id: i._id,
        item_name: i.productName,
        price: i.salePrice,
        quantity: i.quantity,
      })),
    },
  });
};

// Client-side: Purchase (unchanged, for any client-triggered purchases)
export const trackPurchase = (order: any) => {
  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: order.orderId,
      value: order.totalAmount,
      currency: "BDT",
      items: order.items.map((p: any) => ({
        item_id: p.productId,
        item_name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
    },
  });
};

// Server-side helper: Send event to /api/track (uses fetch for SSR compatibility)
const sendToServerGTM = async (eventName: string, params: any, clientId?: string) => {
  if (typeof window === "undefined") {  // Only run server-side
    const payload = {
      eventName,
      params: {
        ...params,
        clientId: clientId || 'server_default',  // Use session/user ID if available
        debug_mode: process.env.NODE_ENV === 'development',
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Server GTM send failed:', response.status);
      } else {
        const result = await response.json();
        console.log('Server GTM sent:', result);  // Should log { success: true }
      }
    } catch (error) {
      console.error('Server GTM error:', error);
    }
  }
};

// Server-side: Product view (e.g., for SSR product pages)
export const trackViewItemServer = async (product: any, clientId?: string) => {
  await sendToServerGTM('view_item', {
    ecommerce: {
      currency: "BDT",
      value: product.price,
      items: [
        {
          item_id: product._id,
          item_name: product.productName,
          price: product.price,
          category: product.category,
        },
      ],
    },
  }, clientId);
};

// Server-side: Add to cart (e.g., via server action)
export const trackAddToCartServer = async (product: any, clientId?: string) => {
  await sendToServerGTM('add_to_cart', {
    ecommerce: {
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
    },
  }, clientId);
};

// Server-side: Begin checkout (e.g., during session update)
export const trackBeginCheckoutServer = async (cart: any[], clientId?: string) => {
  await sendToServerGTM('begin_checkout', {
    ecommerce: {
      currency: "BDT",
      value: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      items: cart.map((i) => ({
        item_id: i._id,
        item_name: i.productName,
        price: i.salePrice,
        quantity: i.quantity,
      })),
    },
  }, clientId);
};

// Server-side: Purchase (ideal for order confirmation in API route)
export const trackPurchaseServer = async (order: any, clientId?: string) => {
  await sendToServerGTM('purchase', {
    ecommerce: {
      transaction_id: order.orderId,
      value: order.totalAmount,
      currency: "BDT",
      items: order.items.map((p: any) => ({
        item_id: p.productId,
        item_name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
    },
  }, clientId);
};