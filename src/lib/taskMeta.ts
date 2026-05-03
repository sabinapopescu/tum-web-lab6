import type { TaskType, Priority } from '../types';

export const TASK_TYPE_META: Record<TaskType, { label: string; color: string; textColor: string; dot: string }> = {
  Bug:      { label: 'Bug',      color: '#fee2e2', textColor: '#dc2626', dot: '#dc2626' },
  Feature:  { label: 'Feature',  color: '#dbeafe', textColor: '#2563eb', dot: '#2563eb' },
  DevOps:   { label: 'DevOps',   color: '#fef9c3', textColor: '#b45309', dot: '#d97706' },
  Research: { label: 'Research', color: '#f3e8ff', textColor: '#7c3aed', dot: '#9333ea' },
  Design:   { label: 'Design',   color: '#fce7f3', textColor: '#be185d', dot: '#ec4899' },
};

export const PRIORITY_META: Record<Priority, { label: string; color: string; textColor: string; dot: string }> = {
  Critical: { label: 'Critical', color: '#fee2e2', textColor: '#dc2626', dot: '#dc2626' },
  High:     { label: 'High',     color: '#ffedd5', textColor: '#c2410c', dot: '#f97316' },
  Medium:   { label: 'Medium',   color: '#fef9c3', textColor: '#b45309', dot: '#eab308' },
  Low:      { label: 'Low',      color: '#dcfce7', textColor: '#15803d', dot: '#22c55e' },
};

export const ALL_TASK_TYPES: TaskType[] = ['Bug', 'Feature', 'DevOps', 'Research', 'Design'];
export const ALL_PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
