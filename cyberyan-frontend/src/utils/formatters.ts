const TAB_COLORS = ["ochre", "clay", "slate", "plum", "moss"] as const;
export type TabColor = (typeof TAB_COLORS)[number];

export function industryTabColor(industry: string | null): TabColor {
  if (!industry) return "slate";
  let hash = 0;
  for (let i = 0; i < industry.length; i++) {
    hash = (hash * 31 + industry.charCodeAt(i)) >>> 0;
  }
  return TAB_COLORS[hash % TAB_COLORS.length];
}

export function initials(fullName: string | null): string {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function titleCase(value: string | null): string {
  if (!value) return "";
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatConnections(count: number | null): string | null {
  if (count === null) return null;
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k connections`;
  return `${count} connections`;
}

export function formatYearsExperience(years: number | null): string | null {
  if (years === null) return null;
  const rounded = Math.round(years);
  return `${rounded} ${rounded === 1 ? "year" : "years"} experience`;
}

export function formatDateRange(start: string | null, end: string | null): string {
  const startLabel = start ?? "?";
  const endLabel = end ?? "Present";
  if (!start && !end) return "";
  return `${startLabel} – ${endLabel}`;
}
