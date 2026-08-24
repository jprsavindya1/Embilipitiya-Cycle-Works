import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let userId = null;
    try {
      const decoded: any = jwt.verify(token.value, JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    
    try {
      // Get all orders for the user, ordered by newest first
      const [orders]: any = await connection.execute(
        `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );

      // We need to fetch items for each order
      // We'll collect all order IDs to do a single IN query for performance
      if (orders.length === 0) {
        return NextResponse.json({ orders: [] });
      }

      const orderIds = orders.map((o: any) => o.id);
      
      const [items]: any = await connection.execute(
        `SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`,
        orderIds
      );

      // We need product images. The images might be in a separate products table, but for now we'll 
      // just pass the basic data, or we could join the products table if it exists.
      // Let's assume the products table is called 'products' and has an 'image_url' field.
      // If that fails, we can just use a placeholder image.
      let productsMap = new Map();
      try {
        const productIds = items.map((i: any) => i.product_id).filter((v: any, i: any, a: any) => a.indexOf(v) === i);
        if (productIds.length > 0) {
          const [products]: any = await connection.execute(
            `SELECT id, image_url FROM products WHERE id IN (${productIds.map(() => '?').join(',')})`,
            productIds
          );
          products.forEach((p: any) => productsMap.set(p.id, p.image_url));
        }
      } catch (e) {
        // Table might not exist or field name might differ, ignore.
      }

      // Group items by order
      const ordersWithItems = orders.map((order: any) => {
        return {
          ...order,
          items: items
            .filter((item: any) => item.order_id === order.id)
            .map((item: any) => ({
              ...item,
              imageUrl: productsMap.get(item.product_id) || null
            }))
        };
      });

      return NextResponse.json({ orders: ordersWithItems });
    } finally {
      connection.release();
    }

  } catch (error: any) {
    console.error('Fetch Orders API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
