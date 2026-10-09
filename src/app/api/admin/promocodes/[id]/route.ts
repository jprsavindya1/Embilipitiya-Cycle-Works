import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, discount_type, discount_value, min_order_value, expiry_date, is_active } = body;

    const expDate = expiry_date ? new Date(expiry_date) : null;
    const connection = await pool.getConnection();
    
    await connection.execute(
      `UPDATE promocodes 
       SET code = ?, discount_type = ?, discount_value = ?, min_order_value = ?, expiry_date = ?, is_active = ?
       WHERE id = ?`,
      [code.toUpperCase(), discount_type, discount_value, min_order_value || 0, expDate, is_active, id]
    );
    
    connection.release();
    return NextResponse.json({ message: 'Promo code updated successfully' });
  } catch (error: any) {
    console.error('Error updating promocode:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const connection = await pool.getConnection();
    
    await connection.execute('DELETE FROM promocodes WHERE id = ?', [id]);
    
    connection.release();
    return NextResponse.json({ message: 'Promo code deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting promocode:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
