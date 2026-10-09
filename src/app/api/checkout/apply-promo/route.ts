import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;
    
    if (!code || cartTotal === undefined) {
      return NextResponse.json({ message: 'Missing code or cartTotal' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
      'SELECT * FROM promocodes WHERE code = ? AND is_active = TRUE',
      [code.toUpperCase()]
    );
    
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid or inactive promo code' }, { status: 400 });
    }

    const promo = rows[0];

    // Check expiry
    if (promo.expiry_date && new Date(promo.expiry_date) < new Date()) {
      return NextResponse.json({ message: 'Promo code has expired' }, { status: 400 });
    }

    // Check minimum order value
    if (promo.min_order_value && cartTotal < parseFloat(promo.min_order_value)) {
      return NextResponse.json({ message: `Minimum order value for this code is Rs. ${promo.min_order_value}` }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    const discountValue = parseFloat(promo.discount_value);
    
    if (promo.discount_type === 'percentage') {
      discount = (cartTotal * discountValue) / 100;
    } else {
      discount = discountValue;
    }

    // Cap discount to cartTotal so total doesn't go negative
    if (discount > cartTotal) {
      discount = cartTotal;
    }

    return NextResponse.json({
      message: 'Promo code applied successfully',
      code: promo.code,
      discount: discount,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value
    });

  } catch (error: any) {
    console.error('Error applying promocode:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
