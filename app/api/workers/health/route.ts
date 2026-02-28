import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { workers } from '@/lib/workers-data';

interface CloudflareScript {
  id: string;
  modified_on: string;
}

interface CloudflareResponse {
  success: boolean;
  result: CloudflareScript[];
}

interface WorkerHealth {
  id: string;
  name: string;
  status: 'active' | 'error' | 'unknown';
  modified_on: string | null;
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('dashboard_session');
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken || !accountId) {
    const fallback: WorkerHealth[] = workers.map((w) => ({
      id: w.id,
      name: w.name,
      status: 'unknown',
      modified_on: null,
    }));
    return NextResponse.json({ workers: fallback }, {
      headers: { 'Cache-Control': 'max-age=60' },
    });
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
      { headers: { Authorization: `Bearer ${apiToken}` } }
    );

    if (!res.ok) {
      throw new Error(`Cloudflare API returned ${res.status}`);
    }

    const data: CloudflareResponse = await res.json();
    const scriptMap = new Map(data.result.map((s) => [s.id, s]));

    const healthData: WorkerHealth[] = workers.map((w) => {
      const script = scriptMap.get(w.id);
      return {
        id: w.id,
        name: w.name,
        status: script ? 'active' : 'unknown',
        modified_on: script?.modified_on ?? null,
      };
    });

    return NextResponse.json({ workers: healthData }, {
      headers: { 'Cache-Control': 'max-age=60' },
    });
  } catch {
    const fallback: WorkerHealth[] = workers.map((w) => ({
      id: w.id,
      name: w.name,
      status: 'error',
      modified_on: null,
    }));
    return NextResponse.json({ workers: fallback }, {
      headers: { 'Cache-Control': 'max-age=60' },
    });
  }
}
