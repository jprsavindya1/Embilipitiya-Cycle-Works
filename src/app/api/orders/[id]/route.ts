import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

  try {
    const connection = await pool.getConnection();

    // The id is likely in 'ORD-123' format
    const numericId = parseInt(id.replace('ORD-', ''));

    if (isNaN(numericId)) {
      connection.release();
      return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
    }

    const [orders]: any = await connection.execute(
      `SELECT * FROM orders WHERE id = ?`,
      [numericId]
    );

    if (orders.length === 0) {
      connection.release();
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const order = orders[0];

    // Security Check: If user_id is set, ensure the logged-in user matches
    if (order.user_id) {
      const cookieStore = await cookies();
      const token = cookieStore.get('ecw_auth_token');
      let isOwner = false;
      if (token) {
        try {
          const decoded: any = jwt.verify(token.value, JWT_SECRET);
          if (decoded.id === order.user_id) isOwner = true;
        } catch (e) {}
      }
      
      if (!isOwner) {
         connection.release();
         return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
      }
    }

    // Fetch items
    const [items]: any = await connection.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [numericId]
    );

    connection.release();

    return NextResponse.json({
      order: {
        ...order,
        items
      }
    });

  } catch (error: any) {
    console.error('Fetch Order Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
