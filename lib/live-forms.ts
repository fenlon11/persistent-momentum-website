// Live HubSpot forms only from Vercel production (fenlon11/pmOS#2343). A local `next start` once
// inherited the shell's form GUIDs and sent test inquiries to the live portal; outside production
// this returns undefined, so the handlers take their existing "form GUID not set" path.
export function liveFormGuid(
  guid: string | undefined,
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  return env.VERCEL_ENV === 'production' || env.PM_ALLOW_LIVE_FORMS === '1' ? guid : undefined;
}
