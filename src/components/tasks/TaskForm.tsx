import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Task, TaskType, Priority, TaskStatus } from '../../types';
import { ALL_TASK_TYPES, ALL_PRIORITIES, TASK_TYPE_META, PRIORITY_META } from '../../lib/taskMeta';
import { Button } from '../shared/Button';

interface Props {
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  initial?: Task;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 12,
  border: '1.5px solid var(--border)',
  background: 'var(--bg-muted)',
  color: 'var(--text)',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: 6,
};

const ALL_STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

export function TaskForm({ onSubmit, onCancel, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [type, setType] = useState<TaskType>(initial?.type ?? 'Feature');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'Medium');
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'Todo');
  const [dueDate, setDueDate] = useState<string | null>(initial?.dueDate ?? null);
  const [errors, setErrors] = useState<{ title?: string }>({});

  function validate() {
    const e: { title?: string } = {};
    if (!title.trim()) e.title = 'Title is required';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const task: Task = initial
      ? {
          ...initial,
          title: title.trim(),
          description: description.trim(),
          type,
          priority,
          status,
          dueDate,
          completedAt: status === 'Done' && initial.status !== 'Done'
            ? Date.now()
            : status !== 'Done'
            ? null
            : initial.completedAt,
        }
      : {
          id: crypto.randomUUID(),
          title: title.trim(),
          description: description.trim(),
          type,
          priority,
          status,
          dueDate,
          isWatched: false,
          createdAt: Date.now(),
          completedAt: status === 'Done' ? Date.now() : null,
        };

    onSubmit(task);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Title */}
      <div>
        <label style={labelStyle}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Fix auth token expiry bug"
          style={{ ...inputStyle, borderColor: errors.title ? '#ef4444' : undefined }}
          autoFocus
        />
        {errors.title && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details, reproduction steps, or acceptance criteria…"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Type */}
      <div>
        <label style={labelStyle}>Type</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_TASK_TYPES.map((t) => {
            const meta = TASK_TYPE_META[t];
            const selected = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 9999,
                  border: `1.5px solid ${selected ? meta.textColor : 'var(--border)'}`,
                  background: selected ? meta.color : 'transparent',
                  color: selected ? meta.textColor : 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label style={labelStyle}>Priority</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_PRIORITIES.map((p) => {
            const meta = PRIORITY_META[p];
            const selected = priority === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 9999,
                  border: `1.5px solid ${selected ? meta.textColor : 'var(--border)'}`,
                  background: selected ? meta.color : 'transparent',
                  color: selected ? meta.textColor : 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <label style={labelStyle}>Status</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 12,
                border: `1.5px solid ${status === s ? 'var(--primary)' : 'var(--border)'}`,
                background: status === s ? 'var(--primary-light)' : 'transparent',
                color: status === s ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label style={labelStyle}>
          Due Date <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          type="date"
          value={dueDate ?? ''}
          onChange={(e) => setDueDate(e.target.value || null)}
          style={inputStyle}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">
          {initial ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
