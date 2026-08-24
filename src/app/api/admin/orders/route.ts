import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function GET(request: Request) {
  try {
    // 1. Verify Admin Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    if (!token) {
      console.log('Admin API Error: No token found in cookies');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded: any = jwt.verify(token.value, JWT_SECRET);
      if (decoded.role !== 'admin') {
        console.log('Admin API Error: Token role is not admin:', decoded);
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } catch (err: any) {
      console.log('Admin API Error: JWT verification failed:', err.message);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Orders
    const connection = await pool.getConnection();
    
    // Fetch all orders sorted by newest first
    const [orders]: any = await connection.execute(
      `SELECT * FROM orders ORDER BY created_at DESC`
    );

    // Fetch items for these orders (if any)
    if (orders.length > 0) {
      const orderIds = orders.map((o: any) => o.id);
      
      // We can fetch all order items in one query using IN clause
      const placeholders = orderIds.map(() => '?').join(',');
      const [items]: any = await connection.execute(
        `SELECT * FROM order_items WHERE order_id IN (${placeholders})`,
        orderIds
      );

      // Map items back to orders
      orders.forEach((order: any) => {
        order.items = items.filter((item: any) => item.order_id === order.id);
      });
    }

    connection.release();

    return NextResponse.json({ orders });

  } catch (error: any) {
    console.error('Admin Orders Fetch Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
