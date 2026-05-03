import type { TaskType, Priority } from '../../types';
import { TASK_TYPE_META, PRIORITY_META } from '../../lib/taskMeta';

interface TypeBadgeProps {
  taskType: TaskType;
  size?: 'sm' | 'md';
}

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

function badgeStyle(color: string, textColor: string, dot: string, size: 'sm' | 'md') {
  return {
    container: {
      background: color,
      color: textColor,
      padding: size === 'sm' ? '2px 8px' : '3px 10px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 600 as const,
      borderRadius: '9999px',
      letterSpacing: '0.02em',
      display: 'inline-flex' as const,
      alignItems: 'center' as const,
      gap: 4,
      whiteSpace: 'nowrap' as const,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: dot,
      flexShrink: 0,
    },
  };
}

export function TypeBadge({ taskType, size = 'sm' }: TypeBadgeProps) {
  const meta = TASK_TYPE_META[taskType];
  const s = badgeStyle(meta.color, meta.textColor, meta.dot, size);
  return (
    <span style={s.container}>
      <span style={s.dot} />
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const meta = PRIORITY_META[priority];
  const s = badgeStyle(meta.color, meta.textColor, meta.dot, size);
  return (
    <span style={s.container}>
      <span style={s.dot} />
      {meta.label}
    </span>
  );
}

// Legacy export for any remaining shared usage
export { TypeBadge as Badge };
