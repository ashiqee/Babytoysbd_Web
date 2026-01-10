import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/dbConnect";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Users from "@/lib/models/users/Users";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { mobile_no, password } = await req.json();

    const user = await Users.findOne({ mobile_no });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15d" }
    );

    return NextResponse.json({
      user: {
        id: user._id,
        mobile_no: user.mobile_no,
        role: user.role,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
