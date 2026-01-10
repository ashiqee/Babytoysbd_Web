
import { dbConnect } from '@/lib/db/dbConnect';
import { Category } from '@/lib/models/products/Category';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const categories = await Category.find();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const category = await Category.create(body);
  return NextResponse.json(category);
}
