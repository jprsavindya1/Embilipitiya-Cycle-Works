import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function PATCH(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;

    // 1. Verify Admin Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // 2. Parse Body
    const body = await request.json();
    const { order_status, payment_status } = body;

    const connection = await pool.getConnection();

    // Check if order exists
    const numericId = parseInt(id.replace('ORD-', ''));
    if (isNaN(numericId)) {
      connection.release();
      return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
    }

    const [orders]: any = await connection.execute('SELECT id FROM orders WHERE id = ?', [numericId]);
    if (orders.length === 0) {
      connection.release();
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // 3. Update Statuses
    let query = 'UPDATE orders SET ';
    const queryParams = [];

    if (order_status) {
      query += 'order_status = ?';
      queryParams.push(order_status);
    }
    
    if (payment_status) {
      if (order_status) query += ', ';
      query += 'payment_status = ?';
      queryParams.push(payment_status);
    }

    if (queryParams.length === 0) {
       connection.release();
       return NextResponse.json({ message: 'Nothing to update' }, { status: 400 });
    }

    query += ' WHERE id = ?';
    queryParams.push(numericId);

    await connection.execute(query, queryParams);

    connection.release();

    return NextResponse.json({ success: true, message: 'Order updated successfully' });

  } catch (error: any) {
    console.error('Admin Order Update Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
