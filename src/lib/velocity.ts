import { format, subDays, parseISO } from 'date-fns';
import type { Task } from '../types';

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function dateOf(ts: number): string {
  return format(new Date(ts), 'yyyy-MM-dd');
}

export function calcProductivityStreak(tasks: Task[]): number {
  const doneDates = new Set<string>(
    tasks.filter((t) => t.completedAt !== null).map((t) => dateOf(t.completedAt!))
  );

  const today = todayStr();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Streak is alive if completed today or yesterday
  const startStr = doneDates.has(today) ? today : doneDates.has(yesterday) ? yesterday : null;
  if (!startStr) return 0;

  let streak = 0;
  let cursor = parseISO(startStr);

  while (doneDates.has(format(cursor, 'yyyy-MM-dd'))) {
    streak++;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export function calcWeeklyVelocity(tasks: Task[]): { date: string; label: string; count: number }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateKey = format(d, 'yyyy-MM-dd');
    const label = format(d, 'EEE');
    const count = tasks.filter(
      (t) => t.completedAt !== null && dateOf(t.completedAt!) === dateKey
    ).length;
    return { date: dateKey, label, count };
  });
}

export function tasksCompletedToday(tasks: Task[]): number {
  const today = todayStr();
  return tasks.filter((t) => t.completedAt !== null && dateOf(t.completedAt!) === today).length;
}
