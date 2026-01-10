// app/api/landing/[id]/route.ts

import { dbConnect } from '@/lib/db/dbConnect';
import { LandingPage } from '@/lib/models/landingPage/LandingPage';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: any }) {
  await dbConnect();
  const page = await LandingPage.findById(params.id);
  return NextResponse.json(page);
}

export async function PUT(req: Request, { params }: { params: any }) {
  const body = await req.json();
  await dbConnect();
  const updated = await LandingPage.findByIdAndUpdate(params.id, { $set: body }, { new: true });
  return NextResponse.json(updated);
}
