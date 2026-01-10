import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import { Shipping } from '@/lib/models/shipping/shipping';

export async function GET() {
  await dbConnect();
  const shippings = await Shipping.find().sort({ createdAt: -1 });
  return NextResponse.json({ data: shippings });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const shipping = await Shipping.create(data);
    return NextResponse.json({ data: shipping }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create shipping' }, { status: 500 });
  }
}
