import type { DateRange } from "@cloudflare/kumo";

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function enumerateDateRange(range: DateRange) {
  if (!range.from || !range.to) return [];

  const dates: Date[] = [];
  const cursor = new Date(range.from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(range.to);
  end.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function rangeContainsDateKeys(
  range: DateRange | undefined,
  dateKeys: string[],
) {
  if (!range?.from || !range.to) return false;
  const blocked = new Set(dateKeys);
  return enumerateDateRange(range).some((date) => blocked.has(toDateKey(date)));
}

export function formatDateRange(range: DateRange) {
  if (!range.from || !range.to) return "Select dates";
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${formatter.format(range.from)} – ${formatter.format(range.to)}`;
}
