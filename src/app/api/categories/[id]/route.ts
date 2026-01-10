import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import { Category } from '@/lib/models/products/Category';
import { categorySchema } from '@/lib/validations/categorySchema';

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

  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PUT(
  req: NextRequest,
  context:paramsProps
) {
  await dbConnect();
  const data = await req.json();

  const {id} = await context.params;

 
  const updated = await Category.findByIdAndUpdate(id, data, {
    new: true,
  });

  return NextResponse.json(updated);
}


export async function DELETE(req: NextRequest,
  context:paramsProps
) {
  await dbConnect();

   const {id} = await context.params;
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
