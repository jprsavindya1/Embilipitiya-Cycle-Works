import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/lib/email';
import { getContactEmail } from '@/lib/settings';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1221598'; // Replace with real or sandbox Merchant ID
const PAYHERE_SECRET = process.env.PAYHERE_SECRET || 'MTc5ODYxOTA2MzQzNTQwMjE5MTMyODY4MDk0MjQxMzA1MDcxODA2'; // Replace with real secret
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact, address, paymentMethod, cart, subtotal, deliveryFee, discount, promoCode, total } = body;

    const storeEmail = await getContactEmail();

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
          subtotal, delivery_fee, discount, promo_code, total, payment_method, payment_status, order_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, contact.email, contact.phone, address.firstName, address.lastName,
          address.addressLine1, address.addressLine2 || null, address.city, address.postalCode, address.country,
          subtotal, deliveryFee, discount || 0, promoCode || null, total, paymentMethod, 'Pending', 'Processing'
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

      // Update promo code usage count if applied
      if (promoCode) {
        await connection.execute(
          `UPDATE promocodes SET usage_count = usage_count + 1 WHERE code = ?`,
          [promoCode.toUpperCase()]
        );
      }

      await connection.commit();
      connection.release();

      const orderReference = `ORD-${orderId}`;

      // Try sending a confirmation email synchronously but handle failures gracefully
      try {
        const textFallback = `Embilipitiya Cycle Works
ORDER #${orderReference}

Thank you for your order!
We're getting your order ready to be shipped. We will notify you when it has been sent.

View Your Order: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-tracking/${orderReference}

Order Summary:
${cart.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - Rs ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Subtotal: Rs ${subtotal.toLocaleString()}
Shipping: Rs ${deliveryFee.toLocaleString()}
${(discount || 0) > 0 ? `Discount: - Rs ${(discount || 0).toLocaleString()}\n` : ''}Total: Rs ${total.toLocaleString()}

Customer Information:
Shipping: ${address.firstName} ${address.lastName}, ${address.addressLine1}, ${address.city}
Payment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'payhere' ? 'Online Payment (PayHere)' : 'Bank Transfer'}

If you have any questions, contact us at ${storeEmail}`;

        // Fire and forget email to prevent blocking the checkout response on SMTP timeouts
        sendEmail({
        to: contact.email,
        subject: `Order Confirmation #${orderReference} - Embilipitiya Cycle Works`,
        text: textFallback,
        html: `
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 12px;">
            
            <!-- Colorful Header -->
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%); padding: 35px 20px; border-radius: 12px 12px 0 0; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Embilipitiya Cycle Works</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 15px;">ORDER #${orderReference}</p>
            </div>

            <!-- Main Content Container -->
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
              
              <!-- Greeting -->
              <div style="text-align: center; margin-bottom: 35px;">
                <h2 style="font-size: 24px; color: #111827; margin: 0 0 10px 0;">Thank you for your order!</h2>
                <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin: 0;">We're getting your order ready to be shipped. We will notify you when it has been sent.</p>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-bottom: 40px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-tracking/${orderReference}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2);">View Your Order</a>
                <div style="margin-top: 15px;">
                  <span style="color: #6b7280; font-size: 14px;">or <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">Visit our store</a></span>
                </div>
              </div>

              <!-- Order Summary Card -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 35px;">
                <h3 style="font-size: 18px; color: #1e293b; margin: 0 0 20px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">Order Summary</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  ${cart.map((item: any) => `
                    <tr>
                      <td style="padding: 12px 15px 12px 0; border-bottom: 1px solid #e2e8f0; width: 60px;">
                        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />` : ''}
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; vertical-align: top;">
                        <div style="color: #0f172a; font-weight: 500; font-size: 15px; line-height: 1.4;">${item.name}</div>
                        <div style="color: #64748b; font-size: 14px; margin-top: 4px;">Qty: ${item.quantity}</div>
                      </td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0f172a; font-weight: 500; vertical-align: middle;">
                        Rs ${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                    </tr>
                  `).join('')}
                </table>

                <table style="width: 100%; margin-top: 15px;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-size: 15px;">Subtotal</td>
                    <td style="padding: 6px 0; text-align: right; color: #334155; font-weight: 500;">Rs ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-size: 15px;">Shipping</td>
                    <td style="padding: 6px 0; text-align: right; color: #334155; font-weight: 500;">Rs ${deliveryFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                  ${(discount || 0) > 0 ? `
                  <tr>
                    <td style="padding: 6px 0; color: #0ea5e9; font-size: 15px;">Discount</td>
                    <td style="padding: 6px 0; text-align: right; color: #0ea5e9; font-weight: 600;">- Rs ${(discount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                  ` : ''}
                </table>

                <div style="border-top: 2px dashed #cbd5e1; margin: 15px 0;"></div>

                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 5px 0; color: #0f172a; font-size: 16px; font-weight: 600;">Total</td>
                    <td style="padding: 5px 0; text-align: right; color: #0ea5e9; font-size: 22px; font-weight: 700;">Rs ${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Total paid today</td>
                    <td style="padding: 5px 0; text-align: right; color: #334155; font-weight: 600; font-size: 14px;">Rs ${paymentMethod === 'payhere' ? total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}</td>
                  </tr>
                </table>
              </div>

              <!-- Customer Info Grid -->
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 18px; color: #1e293b; margin: 0 0 20px 0;">Customer Information</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 50%; vertical-align: top; padding: 0 15px 25px 0;">
                      <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; margin-bottom: 8px;">Shipping Address</div>
                      <div style="color: #334155; line-height: 1.6; font-size: 15px;">
                        ${address.firstName} ${address.lastName}<br>
                        ${address.addressLine1}<br>
                        ${address.addressLine2 ? address.addressLine2 + '<br>' : ''}
                        ${address.city}, ${address.postalCode}
                      </div>
                    </td>
                    <td style="width: 50%; vertical-align: top; padding: 0 0 25px 15px;">
                      <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; margin-bottom: 8px;">Billing Address</div>
                      <div style="color: #334155; line-height: 1.6; font-size: 15px;">
                        ${address.firstName} ${address.lastName}<br>
                        ${address.addressLine1}<br>
                        ${address.addressLine2 ? address.addressLine2 + '<br>' : ''}
                        ${address.city}, ${address.postalCode}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 50%; vertical-align: top; padding: 0 15px 0 0;">
                      <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; margin-bottom: 8px;">Payment Method</div>
                      <div style="color: #334155; font-size: 15px; font-weight: 500;">
                        ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'payhere' ? 'Online Payment (PayHere)' : 'Bank Transfer'}
                      </div>
                    </td>
                    <td style="width: 50%; vertical-align: top; padding: 0 0 0 15px;">
                      <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; margin-bottom: 8px;">Shipping Method</div>
                      <div style="color: #334155; font-size: 15px; font-weight: 500;">Standard Shipping</div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding: 0 20px;">
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
                If you have any questions, reply to this email or contact us at <br>
                <a href="mailto:${storeEmail}" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">${storeEmail}</a>
              </p>
              <div style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Embilipitiya Cycle Works. All rights reserved.
              </div>
            </div>
            
          </div>
        `
        });
      } catch (emailErr) {
        console.error('Failed to send order confirmation email:', emailErr);
      }

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
            return_url: `${SITE_URL}/order-tracking/${orderReference}?status=success`,
            cancel_url: `${SITE_URL}/checkout?status=cancel`,
            notify_url: `${SITE_URL}/api/payhere/notify`,
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
