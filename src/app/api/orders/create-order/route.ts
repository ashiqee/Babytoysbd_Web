// app/api/create-orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';

import { Shipping } from '@/lib/models/shipping/shipping';

import Order from '@/lib/models/orders/order';

function generateOrderId(count: number) {
  const paddedNumber = (count + 1).toString().padStart(4, '0');
  return `BTB-${paddedNumber}`;
}

function generateShippingId(count: number) {
  return `SHIP-${3000 + count}`;
}

// Helper function to extract cookies from request
function getCookie(request: NextRequest, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) return cookieValue;
  }
  return undefined;
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Destructure all required fields from the request body
    const {
      customer,
      productPrice,
      shippingCost,
      itemsQty,
      getDiscount,
      color,
      products,
      paymentDetails,
      giftWrap,
      deliveryOption,
      totalAmount,
      paymentStatus,
      priority,
      deliveryCompany = "SteadFast",
    } = body;

    // Validate required fields
    if (!customer || !customer.fullName || !customer.mobileNumber || !customer.address) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one product' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderCount = await Order.countDocuments();
    const orderId = generateOrderId(orderCount);

    
  
    const customerData = {
      email:customer.email,
      phone:customer.mobileNumber,
      firstName:customer.fullName,
      lastName:customer.lastName,
      externalId:customer.mobileNumber,
    }

    
    // Create initial tracking history
    const trackingHistory = [
      {
        note: 'Order placed successfully',
        status: 'Pending',
        },
    ];

    // Extract Facebook CAPI data
    const facebookData = {
      fbp: getCookie(req, '_fbp'),
      fbc: getCookie(req, '_fbc'),
      userAgent: req.headers.get('user-agent') || undefined,
      clientIP: getClientIP(req),
    };

    const address ={
      street: customer.address,
      city:  customer.division ,
      state: "BD" ,
      zip:  '',
      country:  "Bangladesh",
    }

    // Create the order with Facebook CAPI data
    const newOrder = await Order.create({
      orderId,
      customer:customerData,
      address,
      productPrice,
      shippingCost,
      itemsQty,
      customerNote:customer.instructions,
      getDiscount: getDiscount || 0,
      color: color || '',
      totalAmount: totalAmount || productPrice,
      items:products,
      paymentDetails,
      giftWrap: giftWrap || false,
      deliveryOption: deliveryOption || 'standard',
      paymentStatus: paymentStatus || 'unpaid',
      priority: priority || 'Normal',
      deliveryCompany,
      orderStatus: 'Pending',
      trackingHistory,
      facebookData, // Include Facebook CAPI data
    });

    // Generate shipping ID
    const shippingCount = await Shipping.countDocuments();
    const shippingId = generateShippingId(shippingCount);
    
    // Create shipping record
    const newShipping = await Shipping.create({
      shippingId,
      orderId: `#${orderId}`,
      customer: customer.fullName,
      carrier: deliveryCompany,
      trackingNumber: `TRK${100000 + shippingCount}`,
      status: 'Pending',
      shippedDate: new Date().toISOString().split('T')[0],
      address: customer.address,
      mobileNumber: customer.mobileNumber,
      deliveryOption: deliveryOption || 'standard',
    });

    // Send Facebook InitiateCheckout event
    // try {
    //   await sendInitiateCheckoutEvent(newOrder);
    // } catch (error) {
    //   console.error('Failed to send Facebook InitiateCheckout event:', error);
    //   // Continue with order creation even if Facebook event fails
    // }

    // Return success response with both order and shipping data
    return NextResponse.json(
      {
        message: 'Order created successfully',
        data: { 
          order: newOrder,
          shipping: newShipping,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Helper function to send Facebook InitiateCheckout event
// async function sendInitiateCheckoutEvent(order: any) {
//   // Generate unique event ID for this checkout
//   const eventId = generateEventId('initiate_checkout', order.orderId);

//   // Prepare product data for Facebook
//   const contents = order.products?.map((product: any) => ({
//     id: product.productId || product.id,
//     quantity: product.quantity,
//     item_price: product.price,
//     category: product.category || undefined,
//   })) || [];

//   // Calculate total value
//   const totalValue = order.totalAmount || order.productPrice || 0;

//   // Prepare user data
//   const userData: any = {};
  
//   // Customer data
//   if (order.customer?.email) userData.email = order.customer.email;
//   if (order.customer?.mobileNumber) userData.phone = order.customer.mobileNumber;
  
//   // Extract name parts
//   if (order.customer?.fullName) {
//     const nameParts = order.customer.fullName.split(' ');
//     userData.fn = nameParts[0]; // First name
//     if (nameParts.length > 1) {
//       userData.ln = nameParts.slice(1).join(' '); // Last name
//     }
//   }
  
//   // Address data
//   if (order.customer?.address) {
//     const address = typeof order.customer.address === 'string' 
//       ? order.customer.address 
//       : order.customer.address;
      
//     // Try to extract city, state, etc. if address is an object
//     if (typeof address === 'object') {
//       if (address.city) userData.ct = address.city;
//       if (address.state) userData.st = address.state;
//       if (address.zip) userData.zp = address.zip;
//       if (address.country) userData.country = address.country;
//     }
//   }
  
//   // Facebook CAPI data from stored order
//   if (order.facebookData?.fbp) userData.fbp = order.facebookData.fbp;
//   if (order.facebookData?.fbc) userData.fbc = order.facebookData.fbc;
//   if (order.facebookData?.clientIP) userData.client_ip_address = order.facebookData.clientIP;
//   if (order.facebookData?.userAgent) userData.client_user_agent = order.facebookData.userAgent;

//   // Send Facebook CAPI event
//   await sendServerEvent(
//     'InitiateCheckout',
//     {
//       content_ids: order.products?.map((p: any) => p.productId || p.id) || [],
//       content_type: 'product',
//       contents: contents,
//       currency: order.currency || 'BDT',
//       value: totalValue,
//       num_items: order.itemsQty || order.products?.length || 0,
//     },
//     userData,
//     undefined, // testEventCode
//     eventId
//   );
// }