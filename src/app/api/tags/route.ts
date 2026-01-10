
import { dbConnect } from '@/lib/db/dbConnect';
import { Tags } from '@/lib/models/products/Tags';

import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const tags = await Tags.find();
  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const tag = await Tags.create(body);
  return NextResponse.json(tag);
}
