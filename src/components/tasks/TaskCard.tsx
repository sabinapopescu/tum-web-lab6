import { useState } from 'react';
import { Eye, EyeOff, Trash2, CheckCircle, Circle, Clock, Pencil } from 'lucide-react';
import type { Task } from '../../types';
import { useStore, useToast } from '../../context/useStore';
import { TypeBadge, PriorityBadge } from '../shared/Badge';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { EditTaskModal } from './EditTaskModal';

interface Props {
  task: Task;
}

const STATUS_COLORS: Record<Task['status'], string> = {
  'Todo': 'var(--text-subtle)',
  'In Progress': '#f59e0b',
  'Done': '#22c55e',
};

export function TaskCard({ task }: Props) {
  const { dispatch } = useStore();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [checkAnim, setCheckAnim] = useState(false);

  const isDone = task.status === 'Done';

  function handleToggleDone() {
    dispatch({ type: 'TOGGLE_DONE', id: task.id });
    if (!isDone) {
      setCheckAnim(true);
      setTimeout(() => setCheckAnim(false), 400);
      showToast(`"${task.title}" marked as done`);
    } else {
      showToast(`"${task.title}" reopened`, 'info');
    }
  }

  function handleToggleWatched() {
    dispatch({ type: 'TOGGLE_WATCHED', id: task.id });
    showToast(task.isWatched ? 'Removed from watched' : 'Added to watched', 'info');
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_TASK', id: task.id });
    showToast(`"${task.title}" deleted`, 'error');
    setConfirmDelete(false);
  }

  const statusColor = STATUS_COLORS[task.status];

  return (
    <>
      <div
        className="animate-fade-in"
        style={{
          background: 'var(--bg-card)',
          border: `1.5px solid ${isDone ? 'var(--border)' : task.priority === 'Critical' ? 'rgba(220,38,38,0.4)' : 'var(--border)'}`,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          opacity: isDone ? 0.7 : 1,
          transition: 'opacity 0.2s, border-color 0.2s',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0 }}>
          {/* Done toggle */}
          <button
            onClick={handleToggleDone}
            aria-label={isDone ? 'Reopen task' : 'Mark as done'}
            className={checkAnim ? 'animate-check' : undefined}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: isDone ? '#22c55e' : 'var(--text-subtle)',
              flexShrink: 0,
              marginTop: 2,
              transition: 'color 0.15s',
            }}
          >
            {isDone
              ? <CheckCircle size={20} strokeWidth={2.5} />
              : <Circle size={20} strokeWidth={1.5} />
            }
          </button>

          {/* Title + description */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0,
              fontWeight: 600,
              fontSize: 14,
              color: 'var(--text)',
              textDecoration: isDone ? 'line-through' : 'none',
              textDecorationColor: 'var(--text-subtle)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              letterSpacing: '-0.2px',
            }}>
              {task.title}
            </p>
            {task.description && (
              <p style={{
                margin: '3px 0 0',
                fontSize: 12,
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Bottom row: badges + status + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <TypeBadge taskType={task.type} />
          <PriorityBadge priority={task.priority} />

          {/* Status pill */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: statusColor,
            background: 'var(--bg-muted)',
            padding: '2px 8px',
            borderRadius: 9999,
          }}>
            <Clock size={10} />
            {task.status}
          </span>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto', flexShrink: 0 }}>
            <button
              onClick={handleToggleWatched}
              aria-label={task.isWatched ? 'Unwatch' : 'Watch'}
              title={task.isWatched ? 'Unwatch task' : 'Watch task'}
              style={{
                background: task.isWatched ? 'rgba(79,193,255,0.12)' : 'var(--bg-muted)',
                border: 'none',
                borderRadius: 8,
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: task.isWatched ? 'var(--primary)' : 'var(--text-subtle)',
                transition: 'all 0.15s',
              }}
            >
              {task.isWatched ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
            <button
              onClick={() => setShowEdit(true)}
              aria-label="Edit task"
              style={{
                background: 'var(--bg-muted)',
                border: 'none',
                borderRadius: 8,
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-subtle)',
                transition: 'all 0.15s',
              }}
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              aria-label="Delete task"
              style={{
                background: 'var(--bg-muted)',
                border: 'none',
                borderRadius: 8,
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-subtle)',
                transition: 'all 0.15s',
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {showEdit && <EditTaskModal task={task} onClose={() => setShowEdit(false)} />}

      {confirmDelete && (
        <Modal title="Delete Task" onClose={() => setConfirmDelete(false)} width={400}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: 'var(--text)', fontFamily: 'monospace' }}>{task.title}</strong>?
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
