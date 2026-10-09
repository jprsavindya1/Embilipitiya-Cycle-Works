import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, amount, currency } = body;

    const merchant_id = process.env.PAYHERE_MERCHANT_ID || '1221598';
    const merchant_secret = process.env.PAYHERE_SECRET || 'MTc5ODYxOTA2MzQzNTQwMjE5MTMyODY4MDk0MjQxMzA1MDcxODA2';

    // Hash the secret
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();

    // Format amount to 2 decimal places
    const formattedAmount = parseFloat(amount).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');

    // Generate final hash
    const hashString = merchant_id + order_id + formattedAmount + currency + hashedSecret;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    return NextResponse.json({ hash, merchant_id });
  } catch (error) {
    console.error('PayHere Hash error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
