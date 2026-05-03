import { useState, useEffect } from 'react';
import { Plus, LayoutList } from 'lucide-react';
import { useStore } from '../context/useStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { Button } from '../components/shared/Button';
import { EmptyState } from '../components/shared/EmptyState';

export function TasksPage() {
  const [showModal, setShowModal] = useState(false);
  const { tasks } = useStore();

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

  const sorted = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Tasks</h1>
          <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} · Press N to add
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

      {sorted.length === 0 ? (
        <EmptyState
          icon={<LayoutList />}
          title="No tasks yet"
          description="Create your first task to start tracking your development work."
          action={<Button onClick={() => setShowModal(true)}><Plus size={14} /> New Task</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      )}

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
