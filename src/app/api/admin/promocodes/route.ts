import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT * FROM promocodes ORDER BY createdAt DESC');
    connection.release();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching promocodes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discount_type, discount_value, min_order_value, expiry_date, is_active } = body;
    
    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const id = 'promo_' + crypto.randomBytes(8).toString('hex');
    const expDate = expiry_date ? new Date(expiry_date) : null;

    const connection = await pool.getConnection();
    
    // Check if code exists
    const [existing]: any = await connection.execute('SELECT id FROM promocodes WHERE code = ?', [code.toUpperCase()]);
    if (existing.length > 0) {
      connection.release();
      return NextResponse.json({ message: 'Promo code already exists' }, { status: 400 });
    }

    await connection.execute(
      `INSERT INTO promocodes (id, code, discount_type, discount_value, min_order_value, expiry_date, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, code.toUpperCase(), discount_type, discount_value, min_order_value || 0, expDate, is_active ?? true]
    );
    
    connection.release();
    
    return NextResponse.json({ message: 'Promo code created successfully', id }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating promocode:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
