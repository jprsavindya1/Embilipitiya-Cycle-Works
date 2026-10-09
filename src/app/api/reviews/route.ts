import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const connection = await pool.getConnection();
    try {
      let query = 'SELECT * FROM reviews WHERE approved = TRUE';
      let params: any[] = [];
      
      if (productId) {
        query += ' AND productId = ?';
        params.push(productId);
      }
      
      query += ' ORDER BY date DESC';
      
      const [rows] = await connection.execute(query, params);
      return NextResponse.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, author, rating, comment } = body;

    if (!productId || !author || !rating || !comment) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const id = `r_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'INSERT INTO reviews (id, productId, author, rating, comment, approved) VALUES (?, ?, ?, ?, ?, FALSE)',
        [id, productId, author, rating, comment]
      );
      
      // We return the review but it is NOT approved yet
      return NextResponse.json({
        message: 'Review submitted successfully and is awaiting moderation.',
        review: { id, productId, author, rating, comment, approved: false, date: new Date().toISOString() }
      }, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
