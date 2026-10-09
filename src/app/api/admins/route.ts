import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM admins');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await req.json();
    const hashedPassword = admin.password ? await bcrypt.hash(admin.password, 10) : null;
    await db.query(`
      INSERT INTO admins (id, name, email, password, role, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [admin.id, admin.name, admin.email, hashedPassword, admin.role, admin.status]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    const updateFields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'password' && typeof value === 'string' && value.trim() !== '') {
        updateFields.push(`${key} = ?`);
        values.push(await bcrypt.hash(value, 10));
      } else if (key !== 'password') {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updateFields.length > 0) {
      values.push(id);
      await db.query(`UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`, values);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.query(`DELETE FROM admins WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
