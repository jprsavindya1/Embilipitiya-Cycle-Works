import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    const products = (rows as any[]).map(row => ({
      ...row,
      isNew: Boolean(row.isNew),
      isPublished: Boolean(row.isPublished),
      colors: row.colors ? (typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors) : [],
      sizes: row.sizes ? (typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes) : [],
      gallery: row.gallery ? (typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery) : []
    }));
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const product = await req.json();
    await db.query(`
      INSERT INTO products (id, name, price, originalPrice, category, imageUrl, isNew, description, sku, brand, stock, colors, sizes, rating, gallery, isPublished)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product.id, product.name, product.price, product.originalPrice || null, product.category, product.imageUrl,
      product.isNew ? 1 : 0, product.description || null, product.sku || null, product.brand || null, product.stock || 0,
      JSON.stringify(product.colors || []), JSON.stringify(product.sizes || []), product.rating || 0, JSON.stringify(product.gallery || []), product.isPublished !== false ? 1 : 0
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    const updateFields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (['colors', 'sizes', 'gallery'].includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(JSON.stringify(value || []));
      } else if (['isNew', 'isPublished'].includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(value ? 1 : 0);
      } else {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updateFields.length > 0) {
      values.push(id);
      await db.query(`UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`, values);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.query(`DELETE FROM products WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
