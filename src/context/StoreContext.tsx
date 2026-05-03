import { createContext, useReducer, useEffect, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { Task, FilterState } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'TOGGLE_DONE'; id: string }
  | { type: 'TOGGLE_WATCHED'; id: string }
  | { type: 'SET_FILTER'; filter: Partial<FilterState> }
  | { type: 'SET_TASKS'; tasks: Task[] };

// ── State ─────────────────────────────────────────────────────────────────────

interface StoreState {
  tasks: Task[];
  filter: FilterState;
}

const initialFilter: FilterState = {
  type: 'all',
  priority: 'all',
  status: 'all',
  search: '',
};

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.tasks };

    case 'ADD_TASK':
      return { ...state, tasks: [action.task, ...state.tasks] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)),
      };

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };

    case 'TOGGLE_DONE': {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.id) return t;
          if (t.status === 'Done') {
            return { ...t, status: 'Todo', completedAt: null };
          }
          return { ...t, status: 'Done', completedAt: Date.now() };
        }),
      };
    }

    case 'TOGGLE_WATCHED':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, isWatched: !t.isWatched } : t
        ),
      };

    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.filter } };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

export interface ExportData {
  version: 1;
  exportedAt: string;
  tasks: Task[];
}

interface StoreContextValue {
  tasks: Task[];
  filter: FilterState;
  dispatch: React.Dispatch<Action>;
  exportData: () => void;
  importData: (json: string) => string | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// ── Toast ─────────────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Theme ─────────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>('devpulse_tasks', []);
  const [storedTheme, setStoredTheme] = useLocalStorage<'light' | 'dark'>('devpulse_theme', 'dark');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [state, dispatch] = useReducer(reducer, {
    tasks: storedTasks,
    filter: initialFilter,
  });

  useEffect(() => {
    dispatch({ type: 'SET_TASKS', tasks: storedTasks });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStoredTasks(state.tasks);
  }, [state.tasks, setStoredTasks]);

  useEffect(() => {
    const html = document.documentElement;
    if (storedTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [storedTheme]);

  const toggleTheme = useCallback(() => {
    setStoredTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, [setStoredTheme]);

  const exportData = useCallback(() => {
    const payload: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks: state.tasks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devpulse-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.tasks]);

  const importData = useCallback((json: string): string | null => {
    try {
      const parsed = JSON.parse(json) as Partial<ExportData>;
      if (parsed.version !== 1) return 'Unsupported file version.';
      if (!Array.isArray(parsed.tasks)) return 'Invalid file format: missing tasks array.';
      dispatch({ type: 'SET_TASKS', tasks: parsed.tasks });
      return null;
    } catch {
      return 'Could not parse file. Make sure it is a valid DevPulse JSON export.';
    }
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 280);
    }, 3000);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: storedTheme, toggleTheme }}>
      <ToastContext.Provider value={{ toasts, showToast }}>
        <StoreContext.Provider
          value={{ tasks: state.tasks, filter: state.filter, dispatch, exportData, importData }}
        >
          {children}
        </StoreContext.Provider>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
}

export { StoreContext, ToastContext, ThemeContext };
