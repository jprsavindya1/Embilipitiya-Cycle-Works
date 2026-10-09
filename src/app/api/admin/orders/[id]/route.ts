import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1. Verify Admin Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role !== 'super_admin' && decoded.role !== 'staff') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // 2. Parse Body
    const body = await request.json();
    const { order_status, payment_status, courier, tracking_number, tracking_link } = body;

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
      if (queryParams.length > 0) query += ', ';
      query += 'payment_status = ?';
      queryParams.push(payment_status);
    }
    
    if (courier !== undefined) {
      if (queryParams.length > 0) query += ', ';
      query += 'courier = ?';
      queryParams.push(courier);
    }
    
    if (tracking_number !== undefined) {
      if (queryParams.length > 0) query += ', ';
      query += 'tracking_number = ?';
      queryParams.push(tracking_number);
    }
    
    if (tracking_link !== undefined) {
      if (queryParams.length > 0) query += ', ';
      query += 'tracking_link = ?';
      queryParams.push(tracking_link);
    }

    if (queryParams.length === 0) {
       connection.release();
       return NextResponse.json({ message: 'Nothing to update' }, { status: 400 });
    }

    query += ' WHERE id = ?';
    queryParams.push(numericId);

    await connection.execute(query, queryParams);
    
    // If marked as Shipped, fetch order details and send Email
    if (order_status === 'Shipped') {
      const [orderRows]: any = await connection.execute('SELECT first_name, email, id FROM orders WHERE id = ?', [numericId]);
      if (orderRows.length > 0) {
        const order = orderRows[0];
        const { sendEmail } = require('@/lib/email');
        
        let trackingHtml = '';
        if (courier && tracking_number) {
          trackingHtml = `
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Tracking Information</h3>
              <p style="margin-bottom: 5px; color: #4b5563;"><strong>Courier:</strong> ${courier}</p>
              <p style="margin-bottom: ${tracking_link ? '15px' : '0'}; color: #4b5563;"><strong>Tracking Number:</strong> ${tracking_number}</p>
              ${tracking_link ? `<a href="${tracking_link}" target="_blank" style="display: inline-block; background-color: #1f2937; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 14px;">Track via Courier</a>` : ''}
            </div>
          `;
        }

        sendEmail({
          to: order.email,
          subject: `Your Order is Shipped - #ORD-${order.id}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #ea580c; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Your Order is on the Way!</h1>
              </div>
              
              <div style="padding: 30px;">
                <p style="font-size: 16px; color: #374151;">Hi <strong>${order.first_name}</strong>,</p>
                <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">Great news! Your order <strong>#ORD-${order.id}</strong> has been shipped and is currently on its way to you.</p>
                
                ${trackingHtml}

                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-tracking/ORD-${order.id}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">Track Your Order</a>
                </div>
              </div>
              
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">Embilipitiya Cycle Works &copy; ${new Date().getFullYear()}</p>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 5px;">This is an automated email, please do not reply.</p>
              </div>
            </div>
          `
        }).catch(console.error);
      }
    }

    connection.release();

    return NextResponse.json({ success: true, message: 'Order updated successfully' });

  } catch (error: any) {
    console.error('Admin Order Update Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
