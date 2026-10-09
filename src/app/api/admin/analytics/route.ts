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
    
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role !== 'super_admin' && decoded.role !== 'staff') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const connection = await pool.getConnection();

    try {
      // 1. Total Sales (sum of 'total' in orders where status != cancelled)
      const [salesResult]: any = await connection.execute(
        `SELECT SUM(total) as totalSales FROM orders WHERE order_status != 'Cancelled'`
      );
      const totalSales = salesResult[0].totalSales || 0;

      // 2. Total Orders
      const [ordersResult]: any = await connection.execute(
        `SELECT COUNT(*) as totalOrders FROM orders`
      );
      const totalOrders = ordersResult[0].totalOrders || 0;

      // 3. Total Customers
      const [customersResult]: any = await connection.execute(
        `SELECT COUNT(*) as totalCustomers FROM users`
      );
      const totalCustomers = customersResult[0].totalCustomers || 0;

      // 4. Products Sold (Sum of quantity from order_items)
      const [productsSoldResult]: any = await connection.execute(
        `SELECT SUM(quantity) as totalProductsSold FROM order_items`
      );
      const totalProductsSold = productsSoldResult[0].totalProductsSold || 0;

      // 5. Recent Orders (Last 5)
      const [recentOrders]: any = await connection.execute(
        `SELECT id, first_name, last_name, total, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 5`
      );

      return NextResponse.json({
        totalSales: parseFloat(totalSales).toFixed(2),
        totalOrders,
        totalCustomers,
        totalProductsSold,
        recentOrders
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Admin Analytics error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
