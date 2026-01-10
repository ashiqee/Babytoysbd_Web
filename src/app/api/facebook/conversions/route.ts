// app/api/facebook/conversions/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";


// Helper function to get client IP from headers
function getClientIP(request: NextRequest): string | undefined {
  // Check for common headers that might contain the client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (cfConnectingIP) {
    return cfConnectingIP;
  } else if (forwarded) {
    // The x-forwarded-for header can contain multiple IPs, the first is the client
    return forwarded.split(',')[0].trim();
  } else if (realIP) {
    return realIP;
  } else {
    // Fallback to the connection remote address (if available)
    // Note: In Next.js App Router, we don't have direct access to the socket
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      event_name,
      event_id,
      event_source_url,
      event_time,
      custom_data,
      user_data,
      test_event_code,
    } = await req.json();

    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const pixelId = process.env.FACEBOOK_PIXEL_ID;

    if (!accessToken || !pixelId) {
      console.error("Missing Facebook credentials");
      return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
    }

      const clientIP = getClientIP(req);

    // Hash helper with normalization
    const hash = (val: string) => {
      if (!val) return undefined;
      return crypto
        .createHash("sha256")
        .update(val.trim().toLowerCase())
        .digest("hex");
    };

    // Prepare user_data with enhanced hashing and validation
    const enrichedUserData = {
      em: user_data?.email ? [hash(user_data.email)] : undefined,
      ph: user_data?.phone ? [hash(user_data.phone)] : undefined,
      fn: user_data?.first_name ? hash(user_data.first_name) : undefined,
      ln: user_data?.last_name ? hash(user_data.last_name) : undefined,
      ge: user_data?.gender ? hash(user_data.gender) : undefined,
      ct: user_data?.city ? hash(user_data.city) : undefined,
      st: user_data?.state ? hash(user_data.state) : undefined,
      zp: user_data?.zip ? hash(user_data.zip) : undefined,
      country: user_data?.country ? hash(user_data.country) : undefined,
      external_id: user_data?.external_id ? hash(user_data.external_id) : undefined,
      client_ip_address: user_data?.client_ip || clientIP,
      client_user_agent: user_data?.client_user_agent || req.headers.get("user-agent"),
      fbc: user_data?.fbc, // Facebook click ID
      fbp: user_data?.fbp, // Facebook browser ID
    };

    // Clean undefined values
    const cleanUserData = Object.fromEntries(
      Object.entries(enrichedUserData).filter(([_, v]) => v !== undefined)
    );

    const payload = {
      data: [
        {
          event_name,
          event_time: event_time || Math.floor(Date.now() / 1000),
          event_id: event_id || crypto.randomUUID(),
          event_source_url: event_source_url,
          action_source: "website",
          user_data: cleanUserData,
          custom_data: custom_data || {},
          ...(test_event_code ? { test_event_code } : {}),
        },
      ],
    };

    // Add debug info in development
    if (process.env.NODE_ENV === "development") {
      console.log("FB CAPI Payload:", JSON.stringify(payload, null, 2));
    }

    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!fbResponse.ok) {
      const errorText = await fbResponse.text();
      console.error("Facebook API Error:", fbResponse.status, errorText);
      return NextResponse.json(
        { error: `Facebook API error: ${fbResponse.status}` },
        { status: fbResponse.status }
      );
    }

    const result = await fbResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("FB CAPI Error:", error);
    return NextResponse.json(
      { error: "Failed to send event", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}