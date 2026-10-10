// Public corrections log, newest first, rendered at /corrections (fenlon11/pmOS#685). Add an entry
// in the same PR that fixes the article: date (YYYY-MM-DD), the article's path and title, and what
// was wrong and what it says now.
export type Correction = { date: string; href: string; title: string; summary: string };

export const corrections: Correction[] = [];
