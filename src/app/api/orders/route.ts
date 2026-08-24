import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1221598'; // Replace with real or sandbox Merchant ID
const PAYHERE_SECRET = process.env.PAYHERE_SECRET || 'MTc5ODYxOTA2MzQzNTQwMjE5MTMyODY4MDk0MjQxMzA1MDcxODA2'; // Replace with real secret

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact, address, paymentMethod, cart, subtotal, deliveryFee, total } = body;

    // Validate request
    if (!cart || cart.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    // Attempt to get user from token
    let userId = null;
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    if (token) {
      try {
        const decoded: any = jwt.verify(token.value, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Ignored, anonymous checkout allowed
      }
    }

    // Insert Order
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [orderResult]: any = await connection.execute(
        `INSERT INTO orders (
          user_id, email, phone, first_name, last_name, 
          address_line1, address_line2, city, postal_code, country,
          subtotal, delivery_fee, total, payment_method, payment_status, order_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, contact.email, contact.phone, address.firstName, address.lastName,
          address.addressLine1, address.addressLine2 || null, address.city, address.postalCode, address.country,
          subtotal, deliveryFee, total, paymentMethod, 'Pending', 'Pending'
        ]
      );

      const orderId = orderResult.insertId;

      // Insert Order Items
      for (const item of cart) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)`,
          [orderId, parseInt(item.id.replace('p', '') || '0') || 0, item.name, item.price, item.quantity]
        );
      }

      await connection.commit();
      connection.release();

      const orderReference = `ORD-${orderId}`;

      // Handle PayHere Logic
      if (paymentMethod === 'payhere') {
        // Generate Hash: md5(merchant_id + order_id + amount + currency + md5(merchant_secret))
        const amountFormatted = total.toFixed(2);
        const currency = 'LKR';
        
        const hashedSecret = crypto.createHash('md5').update(PAYHERE_SECRET).digest('hex').toUpperCase();
        const amountStr = amountFormatted.toString();
        const hashString = PAYHERE_MERCHANT_ID + orderReference + amountStr + currency + hashedSecret;
        const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

        return NextResponse.json({
          success: true,
          orderId: orderReference,
          payhere: {
            merchant_id: PAYHERE_MERCHANT_ID,
            return_url: `http://localhost:3000/order-tracking/${orderReference}?status=success`,
            cancel_url: `http://localhost:3000/checkout?status=cancel`,
            notify_url: 'http://localhost:3000/api/payhere/notify',
            order_id: orderReference,
            items: `Order ${orderReference}`,
            currency: currency,
            amount: amountFormatted,
            first_name: address.firstName,
            last_name: address.lastName,
            email: contact.email,
            phone: contact.phone,
            address: address.addressLine1,
            city: address.city,
            country: 'Sri Lanka',
            hash: hash
          }
        });
      }

      // COD or Bank Transfer
      return NextResponse.json({ success: true, orderId: orderReference });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
