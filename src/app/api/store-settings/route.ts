import { dbConnect } from '@/lib/db/dbConnect';
import { StoreSettings } from '@/lib/models/sites/StoreSettings';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
  await dbConnect();
  const settings = await StoreSettings.findOne();
  return NextResponse.json(settings || {});
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const existing = await StoreSettings.findOne();

  if (existing) {
    await StoreSettings.findByIdAndUpdate(existing._id, data, { new: true });
    return NextResponse.json({ message: 'Settings updated' });
  } else {
    await StoreSettings.create(data);
    return NextResponse.json({ message: 'Settings created' });
  }
}
