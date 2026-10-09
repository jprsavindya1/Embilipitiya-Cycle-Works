import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM invite_tokens');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const invite = await req.json();
    await db.query(`
      INSERT INTO invite_tokens (token, role, used)
      VALUES (?, ?, ?)
    `, [invite.token, invite.role, invite.used ? 1 : 0]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { token, used } = await req.json();
    await db.query(`
      UPDATE invite_tokens SET used = ? WHERE token = ?
    `, [used ? 1 : 0, token]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
