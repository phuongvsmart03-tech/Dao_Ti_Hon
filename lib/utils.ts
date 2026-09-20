import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TimeFilterMode, DateItemSummary } from "@/components/HistoricalDateFilterBar"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateVN(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function matchesTimeFilter(
  recordDateStr: string | undefined,
  mode: TimeFilterMode,
  selectedDate: string,
  startDate?: string,
  endDate?: string
): boolean {
  if (mode === 'all') return true;
  if (!recordDateStr) return false;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (mode === 'today') {
    return recordDateStr === todayStr;
  }
  if (mode === 'yesterday') {
    const yest = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
    return recordDateStr === yest;
  }
  if (mode === 'customDate') {
    return !selectedDate || recordDateStr === selectedDate;
  }
  if (mode === 'customRange') {
    if (startDate && recordDateStr < startDate) return false;
    if (endDate && recordDateStr > endDate) return false;
    return true;
  }
  if (mode === 'thisWeek') {
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const monStr = monday.toISOString().split('T')[0];
    const sunStr = sunday.toISOString().split('T')[0];
    return recordDateStr >= monStr && recordDateStr <= sunStr;
  }
  if (mode === 'lastWeek') {
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() + distanceToMonday - 7);
    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);
    const monStr = lastMonday.toISOString().split('T')[0];
    const sunStr = lastSunday.toISOString().split('T')[0];
    return recordDateStr >= monStr && recordDateStr <= sunStr;
  }
  if (mode === 'thisMonth') {
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return recordDateStr.startsWith(currentMonthStr);
  }
  if (mode === 'lastMonth') {
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
    return recordDateStr.startsWith(prevMonthStr);
  }
  return true;
}

export function extractAvailableDates(
  records: Array<{ date?: string; dateSampled?: string; checkDate?: string }>
): DateItemSummary[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const d = r.date || r.dateSampled || r.checkDate;
    if (d) {
      map.set(d, (map.get(d) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

