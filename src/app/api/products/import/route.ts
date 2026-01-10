import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { dbConnect } from '@/lib/db/dbConnect';
import { Product } from '@/lib/models/products/Product';
import { authOptions } from '../../auth/[...nextauth]/authOptions';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'manager'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await dbConnect();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    // Get the last productId
    const lastProduct = await Product.findOne({})
      .sort({ createdAt: -1 })
      .select('productId')
      .lean<{ productId?: string } | null>();

    let nextId = 1;
    if (lastProduct?.productId) {
      const lastNumber = parseInt(lastProduct.productId.replace('PRD-', ''));
      if (!isNaN(lastNumber)) {
        nextId = lastNumber + 1;
      }
    }

    const createdProducts = [];

    for (const item of data) {
      // Only assign productId
      item.productId = `PRD-${String(nextId).padStart(4, '0')}`;
      nextId++;

      const doc = new Product(item);
      const saved = await doc.save();
      createdProducts.push(saved);
    }

    return NextResponse.json({ success: true, count: createdProducts.length });
  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json({ error: 'Failed to import' }, { status: 500 });
  }
}
