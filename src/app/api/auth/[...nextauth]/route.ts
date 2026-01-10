import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

// CORS helper for App Router (Web Response)
function withCors(handler: any) {
  return async (req: Request, context: any) => {
    // Handle preflight CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Run NextAuth
    const response = await handler(req, context);

    // Add CORS headers to actual responses
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    headers.set("Access-Control-Allow-Credentials", "true");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  };
}

const authHandler = NextAuth(authOptions);

export const GET = withCors(authHandler);
export const POST = withCors(authHandler);
export const OPTIONS = withCors(authHandler);
