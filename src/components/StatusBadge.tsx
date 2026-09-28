import type { ReactNode } from 'react';

interface StatusBadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return <span className={`status-badge status-${tone}`}><span aria-hidden="true" className="status-dot" />{children}</span>;
}

export function statusTone(status: string): StatusBadgeProps['tone'] {
  if (status === 'Low') return 'success';
  if (['Moderate', 'High'].includes(status)) return 'warning';
  if (status === 'Critical') return 'danger';
  if (['Completed', 'Assessed'].includes(status)) return 'success';
  if (['Running', 'In migration', 'Retrying'].includes(status)) return 'info';
  if (['Waiting for approval', 'Queued', 'Discovered'].includes(status)) return 'warning';
  if (['Failed', 'Blocked', 'Critical'].includes(status)) return 'danger';
  return 'neutral';
}
