import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import { Tags } from '@/lib/models/products/Tags';


interface paramsProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  context:paramsProps
) {
  await dbConnect();

   const {id} = await context.params;

  const tag = await Tags.findById(id);
  if (!tag) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(tag);
}

export async function PUT(
  req: NextRequest,
  context:paramsProps
) {
  await dbConnect();
  const data = await req.json();

  const {id} = await context.params;

 
  const updated = await Tags.findByIdAndUpdate(id, data, {
    new: true,
  });

  return NextResponse.json(updated);
}


export async function DELETE(req: NextRequest,
  context:paramsProps
) {
  await dbConnect();

   const {id} = await context.params;
  await Tags.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
