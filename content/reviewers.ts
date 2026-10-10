// Allowlist of who may approve an article (`reviewedBy`). A human at Persistent Momentum
// approves every article by merging its PR; the public label is the role, never a personal
// name (Matt, 2026-10-10). Elle Evate (AI) can never appear here. fenlon11/pmOS#680, #681.
export type Reviewer = { slug: string; name: string; kind: 'role' };

export const reviewers: Reviewer[] = [
  { slug: 'pm-editor', name: 'a Persistent Momentum editor', kind: 'role' },
];

export const defaultReviewer = reviewers[0];
