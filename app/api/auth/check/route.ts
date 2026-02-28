import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('dashboard_session');
  const authenticated = session?.value === 'authenticated';
  return NextResponse.json({ authenticated });
}
