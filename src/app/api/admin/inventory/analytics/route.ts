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
      // 1. Top Selling Products (All time or last X days, we'll do all time for now to match mock context)
      const [topSellingResult]: any = await connection.execute(
        `SELECT 
            oi.product_name as name, 
            CAST(SUM(oi.quantity) AS UNSIGNED) as sold
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE o.order_status != 'Cancelled'
         GROUP BY oi.product_name
         ORDER BY sold DESC
         LIMIT 5`
      );

      // 2. Inventory Velocity (Last 28 Days grouped into 4 weeks for top 3 products)
      const [recentSalesResult]: any = await connection.execute(
        `SELECT 
            oi.product_name, 
            oi.quantity, 
            o.createdAt
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE o.order_status != 'Cancelled'
           AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 28 DAY)`
      );

      // Node.js processing for Velocity Chart
      // First find top 3 products in the last 28 days
      const salesByProduct: Record<string, number> = {};
      recentSalesResult.forEach((row: any) => {
        if (!salesByProduct[row.product_name]) {
          salesByProduct[row.product_name] = 0;
        }
        salesByProduct[row.product_name] += row.quantity;
      });

      const top3Products = Object.entries(salesByProduct)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);

      // Create 4 week buckets
      const now = new Date();
      const weekBuckets = [
        { start: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000), end: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), name: 'Week 1' },
        { start: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), end: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), name: 'Week 2' },
        { start: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), end: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), name: 'Week 3' },
        { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), end: now, name: 'Week 4' }
      ];

      const velocityData = weekBuckets.map(bucket => {
        const bucketData: any = { name: bucket.name };
        top3Products.forEach(prod => {
          bucketData[prod] = 0;
        });

        recentSalesResult.forEach((row: any) => {
          const rowDate = new Date(row.createdAt);
          if (rowDate >= bucket.start && rowDate < bucket.end && top3Products.includes(row.product_name)) {
            bucketData[row.product_name] += row.quantity;
          }
        });
        return bucketData;
      });

      return NextResponse.json({
        topSellingData: topSellingResult,
        velocityData: velocityData,
        topVelocityProducts: top3Products
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Inventory Analytics API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
