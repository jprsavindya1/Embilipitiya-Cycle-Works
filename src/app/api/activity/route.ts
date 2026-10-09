import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM activity_logs ORDER BY timestamp DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const log = await req.json();
    await db.query(`
      INSERT INTO activity_logs (id, adminId, adminName, action, target, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [log.id, log.adminId, log.adminName, log.action, log.target, log.details || null]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
