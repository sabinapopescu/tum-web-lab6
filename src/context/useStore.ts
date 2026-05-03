import { useContext, useCallback } from 'react';
import { StoreContext, ToastContext, ThemeContext } from './StoreContext';
import type { FilterState, Task, TaskStatus } from '../types';

export type { Toast } from './StoreContext';

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within StoreProvider');
  return ctx;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within StoreProvider');
  return ctx;
}

export function useActiveTasks(): Task[] {
  const { tasks } = useStore();
  return tasks;
}

export function useFilteredTasks(): Task[] {
  const { tasks, filter } = useStore();

  return tasks.filter((t) => {
    if (filter.type !== 'all' && t.type !== filter.type) return false;
    if (filter.priority !== 'all' && t.priority !== filter.priority) return false;

    if (filter.status === 'watched') {
      if (!t.isWatched) return false;
    } else if (filter.status !== 'all') {
      if (t.status !== (filter.status as TaskStatus)) return false;
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
    }

    return true;
  });
}

export function useSetFilter() {
  const { dispatch } = useStore();
  return useCallback(
    (filter: Partial<FilterState>) => {
      dispatch({ type: 'SET_FILTER', filter });
    },
    [dispatch]
  );
}
