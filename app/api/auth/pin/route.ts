import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const dashboardPin = process.env.DASHBOARD_PIN;

  if (!dashboardPin) {
    return NextResponse.json({ success: false, error: 'Dashboard PIN not configured' }, { status: 401 });
  }

  const body = await request.json();
  const { pin } = body as { pin: string };

  if (!pin || pin !== dashboardPin) {
    return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('dashboard_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 86400,
  });

  return NextResponse.json({ success: true });
}
