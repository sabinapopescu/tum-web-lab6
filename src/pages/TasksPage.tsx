import { useState, useEffect } from 'react';
import { Plus, LayoutList } from 'lucide-react';
import { useStore } from '../context/useStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { Button } from '../components/shared/Button';
import { EmptyState } from '../components/shared/EmptyState';
import type { Task } from '../types';

function urgencySort(arr: Task[]): Task[] {
  const today = new Date().toISOString().slice(0, 10);
  return [...arr].sort((a, b) => {
    const aOverdue = !!(a.dueDate && a.dueDate < today && a.status !== 'Done');
    const bOverdue = !!(b.dueDate && b.dueDate < today && b.status !== 'Done');
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
    if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0;
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return b.createdAt - a.createdAt;
  });
}

export function TasksPage() {
  const [showModal, setShowModal] = useState(false);
  const { tasks } = useStore();
  const [orderedTasks, setOrderedTasks] = useState<Task[]>(() => urgencySort(tasks));
  const [dragSrc, setDragSrc] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === 'n' && !e.ctrlKey && !e.metaKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        setShowModal(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Keep orderedTasks in sync: preserve drag order for existing tasks,
  // prepend new tasks (urgency-sorted), drop deleted ones.
  useEffect(() => {
    setOrderedTasks((prev) => {
      const taskMap = new Map(tasks.map((t) => [t.id, t]));
      const existingIds = new Set(prev.map((t) => t.id));
      const updated = prev
        .filter((t) => taskMap.has(t.id))
        .map((t) => taskMap.get(t.id)!);
      const newTasks = urgencySort(tasks.filter((t) => !existingIds.has(t.id)));
      return [...newTasks, ...updated];
    });
  }, [tasks]);

  function handleDragStart(i: number) {
    setDragSrc(i);
  }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    setDragOver(i);
  }

  function handleDrop(i: number) {
    if (dragSrc === null || dragSrc === i) {
      setDragSrc(null);
      setDragOver(null);
      return;
    }
    const next = [...orderedTasks];
    const [moved] = next.splice(dragSrc, 1);
    next.splice(i, 0, moved);
    setOrderedTasks(next);
    setDragSrc(null);
    setDragOver(null);
  }

  function handleDragEnd() {
    setDragSrc(null);
    setDragOver(null);
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Tasks</h1>
          <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} · Press N to add · Drag to reorder
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--primary)', color: '#fff', border: 'none',
            borderRadius: 12, padding: '8px 16px', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Plus size={16} />
          <span className="btn-label">New Task</span>
        </button>
      </div>

      {orderedTasks.length === 0 ? (
        <EmptyState
          icon={<LayoutList />}
          title="No tasks yet"
          description="Create your first task to start tracking your development work."
          action={<Button onClick={() => setShowModal(true)}><Plus size={14} /> New Task</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orderedTasks.map((task, i) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={handleDragEnd}
              style={{
                opacity: dragSrc === i ? 0.35 : 1,
                outline: dragOver === i && dragSrc !== i ? '2px solid var(--primary)' : '2px solid transparent',
                borderRadius: 14,
                cursor: 'grab',
                transition: 'opacity 0.15s, outline-color 0.1s',
              }}
            >
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
