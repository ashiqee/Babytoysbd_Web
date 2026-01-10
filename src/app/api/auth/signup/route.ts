import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db/dbConnect";
import Users from "@/lib/models/users/Users";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, mobile_no, password } = body;

  if (!name || !password || (!email && !mobile_no)) {
    return NextResponse.json(
      { message: "Name, password, and email or mobile number are required." },
      { status: 400 }
    );
  }

  await dbConnect();

  const existingUser = await Users.findOne({
    $or: [
      email ? { email } : null,
      mobile_no ? { mobile_no } : null,
    ].filter(Boolean) as { [key: string]: any }[],
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists with this email or mobile number." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await Users.create({
    name,
    email: email || null,
    mobile_no: mobile_no || null,
    password: hashedPassword,
    role: "customer",
  });

  return NextResponse.json(
    { message: "User created", userId: newUser._id },
    { status: 201 }
  );
}
