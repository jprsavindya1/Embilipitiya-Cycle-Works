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
