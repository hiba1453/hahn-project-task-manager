export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function pct(completed: number, total: number) {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
}
