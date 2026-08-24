import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const orderId = params.id.replace('ORD-', '');

    // Basic user auth
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    let userId = null;
    if (token) {
      try {
        const decoded: any = jwt.verify(token.value, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Ignored
      }
    }

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('slip') as File;

    const depositDate = formData.get('deposit_date') as string || null;
    const depositorName = formData.get('depositor_name') as string || null;
    const depositorPhone = formData.get('depositor_phone') as string || null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return NextResponse.json({ message: 'File must be an image or PDF' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.type === 'application/pdf' ? '.pdf' : path.extname(file.name) || '.jpg';
    const filename = `${uniqueSuffix}-slip${extension}`;
    
    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'slips');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/slips/${filename}`;

    // Update database
    const connection = await pool.getConnection();
    try {
      // Ensure the order belongs to this user before updating
      const [orderCheck]: any = await connection.execute(
        `SELECT id FROM orders WHERE id = ? AND user_id = ?`,
        [orderId, userId]
      );

      if (orderCheck.length === 0) {
        return NextResponse.json({ message: 'Order not found or unauthorized' }, { status: 404 });
      }

      await connection.execute(
        `UPDATE orders SET payment_slip_url = ?, deposit_date = ?, depositor_name = ?, depositor_phone = ? WHERE id = ?`,
        [fileUrl, depositDate, depositorName, depositorPhone, orderId]
      );
      
      return NextResponse.json({ success: true, url: fileUrl });
    } finally {
      connection.release();
    }

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
