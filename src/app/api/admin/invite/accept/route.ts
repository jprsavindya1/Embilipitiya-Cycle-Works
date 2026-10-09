import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  let connection;
  try {
    const { token, name, email, password } = await req.json();

    if (!token || !name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    connection = await pool.getConnection();
    
    // Start a transaction to ensure single-use
    await connection.beginTransaction();

    try {
      // 1. Check if token exists and is unused (FOR UPDATE locks the row to prevent race conditions)
      const [tokenRows]: any = await connection.execute(
        'SELECT * FROM invite_tokens WHERE token = ? AND used = 0 FOR UPDATE',
        [token]
      );

      if (tokenRows.length === 0) {
        await connection.rollback();
        return NextResponse.json({ message: 'Invalid or expired invite token' }, { status: 400 });
      }

      const invite = tokenRows[0];

      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminId = `admin_${Date.now()}`;

      // 3. Insert the new admin
      await connection.execute(
        `INSERT INTO admins (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [adminId, name, email.toLowerCase(), hashedPassword, invite.role, 'active']
      );

      // 4. Mark token as used
      await connection.execute(
        'UPDATE invite_tokens SET used = 1 WHERE token = ?',
        [token]
      );

      // Commit the transaction
      await connection.commit();

      return NextResponse.json({ 
        success: true, 
        message: 'Admin account created successfully',
        admin: {
          id: adminId,
          name,
          email: email.toLowerCase(),
          role: invite.role,
          status: 'active'
        }
      });
      
    } catch (dbError) {
      // Rollback in case of any error during the transaction
      await connection.rollback();
      throw dbError;
    }

  } catch (error) {
    console.error('Invite accept error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
