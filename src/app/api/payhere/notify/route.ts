import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1221598';
const PAYHERE_SECRET = process.env.PAYHERE_SECRET || 'MTc5ODYxOTA2MzQzNTQwMjE5MTMyODY4MDk0MjQxMzA1MDcxODA2';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const merchant_id = formData.get('merchant_id') as string;
    const order_id = formData.get('order_id') as string;
    const payhere_amount = formData.get('payhere_amount') as string;
    const payhere_currency = formData.get('payhere_currency') as string;
    const status_code = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;

    // Verify Signature
    const hashedSecret = crypto.createHash('md5').update(PAYHERE_SECRET).digest('hex').toUpperCase();
    const hashString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
    const expectedHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    if (md5sig !== expectedHash) {
      console.error('PayHere Signature Verification Failed');
      return NextResponse.json({ message: 'Invalid Signature' }, { status: 400 });
    }

    // Determine status
    let paymentStatus = 'Pending';
    if (status_code === '2') {
      paymentStatus = 'Paid';
    } else if (status_code === '0') {
      paymentStatus = 'Pending'; // Pending
    } else if (status_code === '-1') {
      paymentStatus = 'Canceled';
    } else if (status_code === '-2') {
      paymentStatus = 'Failed';
    } else if (status_code === '-3') {
      paymentStatus = 'Chargedback';
    }

    // Extract raw DB ID from ORD-123
    const dbOrderId = parseInt(order_id.replace('ORD-', ''));

    if (!isNaN(dbOrderId)) {
      const connection = await pool.getConnection();
      try {
        await connection.execute(
          `UPDATE orders SET payment_status = ? WHERE id = ?`,
          [paymentStatus, dbOrderId]
        );

        // Send confirmation email if paid
        if (paymentStatus === 'Paid') {
          const [orderRows]: any = await connection.execute('SELECT * FROM orders WHERE id = ?', [dbOrderId]);
          if (orderRows.length > 0) {
            const order = orderRows[0];
            const { sendEmail } = require('@/lib/email');
            try {
              await sendEmail({
              to: order.email,
              subject: `Payment Received & Order Confirmation - #ORD-${order.id}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #0d9488;">Payment Successful!</h2>
                  <p>Hi ${order.first_name},</p>
                  <p>We have successfully received your payment of Rs. ${parseFloat(order.total).toFixed(2)} via PayHere.</p>
                  <p>Your order <strong>#ORD-${order.id}</strong> is now confirmed and we will begin processing it right away.</p>
                  <p>You can track the status of your order by visiting our website.</p>
                  <br/>
                  <p>Best regards,<br/>Embilipitiya Cycle Works</p>
                </div>
              `
              });
            } catch (emailErr) {
              console.error('Failed to send payment confirmation email:', emailErr);
            }
          }
        }

      } finally {
        connection.release();
      }
    }

    // PayHere requires a 200 OK response to acknowledge receipt
    return NextResponse.json({ message: 'Success' }, { status: 200 });

  } catch (error) {
    console.error('PayHere Notify Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
