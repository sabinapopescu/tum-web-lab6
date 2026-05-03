import { useState } from 'react';
import { Trash2, Circle, CheckCircle, Clock, CalendarDays } from 'lucide-react';
import type { Task } from '../../types';
import { useStore, useToast } from '../../context/useStore';
import { TypeBadge, PriorityBadge } from '../shared/Badge';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

const STATUS_COLORS: Record<Task['status'], string> = {
  'Todo': 'var(--text-subtle)',
  'In Progress': '#f59e0b',
  'Done': '#22c55e',
};

function getDueDateInfo(dueDate: string) {
  const due = new Date(dueDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, isOverdue: true, isSoon: false };
  if (diff === 0) return { label: 'Due today', isOverdue: false, isSoon: true };
  if (diff === 1) return { label: 'Due tomorrow', isOverdue: false, isSoon: true };
  if (diff <= 3) return { label: `Due in ${diff}d`, isOverdue: false, isSoon: true };
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue: false,
    isSoon: false,
  };
}

export function TaskCard({ task }: { task: Task }) {
  const { dispatch } = useStore();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isDone = task.status === 'Done';
  const due = task.dueDate && !isDone ? getDueDateInfo(task.dueDate) : null;

  function handleToggleDone() {
    dispatch({ type: 'TOGGLE_DONE', id: task.id });
    if (!isDone) showToast(`"${task.title}" marked as done`);
    else showToast(`"${task.title}" reopened`, 'info');
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_TASK', id: task.id });
    showToast(`"${task.title}" deleted`, 'error');
    setConfirmDelete(false);
  }

  const borderColor = !isDone && due?.isOverdue
    ? 'rgba(239,68,68,0.5)'
    : !isDone && task.priority === 'Critical'
    ? 'rgba(220,38,38,0.4)'
    : 'var(--border)';

  return (
    <>
      <div
        style={{
          background: 'var(--bg-card)',
          border: `1.5px solid ${borderColor}`,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          opacity: isDone ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <button
            onClick={handleToggleDone}
            aria-label={isDone ? 'Reopen task' : 'Mark as done'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              color: isDone ? '#22c55e' : 'var(--text-subtle)', flexShrink: 0, marginTop: 2,
            }}
          >
            {isDone ? <CheckCircle size={20} strokeWidth={2.5} /> : <Circle size={20} strokeWidth={1.5} />}
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--text)',
              textDecoration: isDone ? 'line-through' : 'none',
              textDecorationColor: 'var(--text-subtle)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              fontFamily: 'monospace',
            }}>
              {task.title}
            </p>
            {task.description && (
              <p style={{
                margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <TypeBadge taskType={task.type} />
          <PriorityBadge priority={task.priority} />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 600, color: STATUS_COLORS[task.status],
            background: 'var(--bg-muted)', padding: '2px 8px', borderRadius: 9999,
          }}>
            <Clock size={10} />
            {task.status}
          </span>

          {due && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 600,
              color: due.isOverdue ? '#ef4444' : due.isSoon ? '#f59e0b' : 'var(--text-muted)',
              background: due.isOverdue ? 'rgba(239,68,68,0.1)' : due.isSoon ? 'rgba(245,158,11,0.1)' : 'var(--bg-muted)',
              padding: '2px 8px', borderRadius: 9999,
            }}>
              <CalendarDays size={10} />
              {due.label}
            </span>
          )}

          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete task"
            style={{
              marginLeft: 'auto', background: 'var(--bg-muted)', border: 'none',
              borderRadius: 8, width: 30, height: 30, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-subtle)',
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <Modal title="Delete Task" onClose={() => setConfirmDelete(false)} width={400}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            Delete <strong style={{ color: 'var(--text)', fontFamily: 'monospace' }}>{task.title}</strong>?
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
