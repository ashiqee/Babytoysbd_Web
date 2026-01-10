import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import { Shipping } from '@/lib/models/shipping/shipping';

export async function PUT(req: NextRequest, { params }: {params: any }) {
  await dbConnect();
  const data = await req.json();
  const shipping = await Shipping.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json({ data: shipping });
}

export async function DELETE(_: NextRequest, { params }: {params: any }) {
  await dbConnect();
  await Shipping.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
