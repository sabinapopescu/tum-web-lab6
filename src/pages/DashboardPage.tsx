import { useState } from 'react';
import { Plus, Circle, Clock } from 'lucide-react';
import { useStore, useToast } from '../context/useStore';
import { tasksCompletedToday } from '../lib/velocity';
import { TypeBadge, PriorityBadge } from '../components/shared/Badge';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import type { Task } from '../types';

export function DashboardPage() {
  const { tasks, dispatch } = useStore();
  const { showToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);

  const doneToday = tasksCompletedToday(tasks);
  const active = tasks.filter((t) => t.status !== 'Done');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  function handleToggle(task: Task) {
    dispatch({ type: 'TOGGLE_DONE', id: task.id });
    if (task.status !== 'Done') showToast(`"${task.title}" marked as done`);
    else showToast(`"${task.title}" reopened`, 'info');
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px', flex: 1 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{greeting}, Developer</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
            {active.length} open task{active.length !== 1 ? 's' : ''} · {doneToday} done today
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={15} /> New Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Tasks', value: tasks.length, accent: undefined as string | undefined },
          { label: 'Active', value: active.length, accent: active.length > 0 ? 'var(--primary)' : undefined },
          { label: 'Done Today', value: doneToday, accent: doneToday > 0 ? '#22c55e' : undefined },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px' }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: accent ?? 'var(--text)', fontFamily: 'monospace' }}>{value}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
        <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Active Tasks</h2>
        {active.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--text-subtle)', fontSize: 13 }}>No active tasks — all clear!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {active.slice(0, 10).map((task) => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--bg-muted)', borderRadius: 10 }}>
                <button
                  onClick={() => handleToggle(task)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-subtle)', flexShrink: 0 }}
                >
                  {task.status === 'In Progress'
                    ? <Clock size={18} style={{ color: '#f59e0b' }} />
                    : <Circle size={18} strokeWidth={1.5} />}
                </button>
                <span style={{ flex: 1, fontSize: 13, fontFamily: 'monospace', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.title}
                </span>
                <TypeBadge taskType={task.type} />
                <PriorityBadge priority={task.priority} />
              </div>
            ))}
            {active.length > 10 && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                +{active.length - 10} more — see Tasks page
              </p>
            )}
          </div>
        )}
      </div>

      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
