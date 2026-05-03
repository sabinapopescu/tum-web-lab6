import { useMemo } from 'react';
import { CheckCircle, BarChart2, Clock, Eye } from 'lucide-react';
import { useStore } from '../context/useStore';
import { TASK_TYPE_META, PRIORITY_META, ALL_TASK_TYPES, ALL_PRIORITIES } from '../lib/taskMeta';
import { calcProductivityStreak, calcWeeklyVelocity, tasksCompletedToday } from '../lib/velocity';
import { TypeBadge, PriorityBadge } from '../components/shared/Badge';
import { EmptyState } from '../components/shared/EmptyState';

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 16,
      padding: '18px 20px',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', fontFamily: 'monospace' }}>{value}</p>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
      </div>
    </div>
  );
}

export function StatsPage() {
  const { tasks } = useStore();

  const streak = calcProductivityStreak(tasks);
  const doneToday = tasksCompletedToday(tasks);
  const doneTasks = tasks.filter((t) => t.status === 'Done');
  const activeTasks = tasks.filter((t) => t.status !== 'Done');
  const velocity = calcWeeklyVelocity(tasks);
  const maxVelocity = Math.max(1, ...velocity.map((v) => v.count));

  const typeData = useMemo(() =>
    ALL_TASK_TYPES.map((type) => ({
      type,
      count: tasks.filter((t) => t.type === type).length,
      done: tasks.filter((t) => t.type === type && t.status === 'Done').length,
    })).filter((x) => x.count > 0),
    [tasks]
  );

  const priorityData = useMemo(() =>
    ALL_PRIORITIES.map((p) => ({
      priority: p,
      count: tasks.filter((t) => t.priority === p && t.status !== 'Done').length,
    })).filter((x) => x.count > 0),
    [tasks]
  );

  const maxTypeCount = Math.max(1, ...typeData.map((x) => x.count));
  const maxPriorityCount = Math.max(1, ...priorityData.map((x) => x.count));
  const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  if (tasks.length === 0) {
    return (
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px', flex: 1 }}>
        <EmptyState
          icon={<BarChart2 />}
          title="No stats yet"
          description="Create tasks and start working to see your development velocity and analytics here."
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Stats</h1>
        <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>Development velocity and analytics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Tasks" value={tasks.length} icon={<BarChart2 size={20} />} color="#0969da" />
        <StatCard label="Completed" value={doneTasks.length} icon={<CheckCircle size={20} />} color="#22c55e" />
        <StatCard label="Done Today" value={doneToday} icon={<Clock size={20} />} color="#f59e0b" />
        <StatCard label="Streak" value={`${streak}d`} icon={<Eye size={20} />} color="#9333ea" />
        <StatCard label="Completion Rate" value={`${completionRate}%`} icon={<BarChart2 size={20} />} color={completionRate >= 70 ? '#22c55e' : completionRate >= 40 ? '#f59e0b' : '#ef4444'} />
        <StatCard label="Active Tasks" value={activeTasks.length} icon={<Clock size={20} />} color="#0969da" />
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '20px', border: '1px solid var(--border)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>By Type</h2>
            {typeData.length === 0 ? <p style={{ margin: 0, fontSize: 13, color: 'var(--text-subtle)' }}>No data yet</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {typeData.map(({ type, count, done }) => {
                  const meta = TASK_TYPE_META[type];
                  return (
                    <div key={type}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <TypeBadge taskType={type} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{done}/{count}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 4, background: 'var(--bg-muted)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(count / maxTypeCount) * 100}%`, background: meta.dot, borderRadius: 4, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '20px', border: '1px solid var(--border)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Open by Priority</h2>
            {priorityData.length === 0 ? <p style={{ margin: 0, fontSize: 13, color: 'var(--text-subtle)' }}>No open tasks</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {priorityData.map(({ priority, count }) => {
                  const meta = PRIORITY_META[priority];
                  return (
                    <div key={priority}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <PriorityBadge priority={priority} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{count}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 4, background: 'var(--bg-muted)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(count / maxPriorityCount) * 100}%`, background: meta.dot, borderRadius: 4, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '20px', border: '1px solid var(--border)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Weekly Velocity</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
              {velocity.map((day) => {
                const pct = day.count / maxVelocity;
                const isToday = day.date === new Date().toISOString().slice(0, 10);
                return (
                  <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 600 }}>{day.count > 0 ? day.count : ''}</span>
                    <div style={{ width: '100%', height: 72, display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{
                        width: '100%',
                        height: day.count === 0 ? 4 : `${Math.max(6, pct * 68)}px`,
                        background: isToday ? 'var(--primary)' : day.count > 0 ? '#22c55e' : 'var(--border)',
                        borderRadius: '4px 4px 2px 2px',
                        transition: 'height 0.4s ease',
                        opacity: day.count === 0 ? 0.3 : 1,
                      }} />
                    </div>
                    <span style={{ fontSize: 10, color: isToday ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: isToday ? 700 : 400 }}>{day.label}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              {doneTasks.length} total tasks completed{doneToday > 0 ? ` · ${doneToday} today` : ''}
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '20px', border: '1px solid var(--border)', overflowX: 'auto' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>All Tasks</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Title', 'Type', 'Priority', 'Status'].map((col) => (
                    <th key={col} style={{ textAlign: col === 'Title' ? 'left' : 'center', padding: '6px 8px', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...tasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 20).map((task) => (
                  <tr key={task.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 600, color: task.status === 'Done' ? 'var(--text-muted)' : 'var(--text)', maxWidth: 200, fontFamily: 'monospace', fontSize: 12 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', textDecoration: task.status === 'Done' ? 'line-through' : 'none', textDecorationColor: 'var(--text-subtle)' }}>{task.title}</span>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}><TypeBadge taskType={task.type} /></td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}><PriorityBadge priority={task.priority} /></td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: task.status === 'Done' ? '#22c55e' : task.status === 'In Progress' ? '#f59e0b' : 'var(--text-muted)', background: 'var(--bg-muted)', padding: '2px 8px', borderRadius: 9999, whiteSpace: 'nowrap' }}>{task.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tasks.length > 20 && <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>Showing 20 of {tasks.length} tasks</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
