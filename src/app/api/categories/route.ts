import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM categories ORDER BY createdAt ASC');
    
    // Parse subcategories if they are strings
    const parsedRows = rows.map(row => ({
      ...row,
      subcategories: typeof row.subcategories === 'string' ? JSON.parse(row.subcategories) : row.subcategories
    }));

    return NextResponse.json(parsedRows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const category = await req.json();
    
    // Convert subcategories to JSON string for MySQL
    const subcats = category.subcategories ? JSON.stringify(category.subcategories) : '[]';
    
    await db.query(`
      INSERT INTO categories (id, name, subcategories)
      VALUES (?, ?, ?)
    `, [category.id, category.name, subcats]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const category = await req.json();
    const subcats = category.subcategories ? JSON.stringify(category.subcategories) : '[]';
    
    await db.query(`
      UPDATE categories SET name = ?, subcategories = ? WHERE id = ?
    `, [category.name, subcats, category.id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
