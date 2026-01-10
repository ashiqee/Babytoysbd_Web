import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function verifyAdmin(req: NextRequest) {
  // 1️⃣ Try Web Admin (NextAuth Session)
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin") {
    return { ok: true, source: "session", user: session.user };
  }

  // 2️⃣ Try Mobile Admin (Bearer JWT)
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return { ok: false, status: 403, error: "Forbidden" };
    }

    return { ok: true, source: "token", user: decoded };

  } catch (error) {
    return { ok: false, status: 401, error: "Invalid token" };
  }
}
