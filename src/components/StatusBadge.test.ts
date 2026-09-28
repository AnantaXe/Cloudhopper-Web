import { describe, expect, it } from 'vitest';
import { statusTone } from './StatusBadge';

describe('statusTone', () => {
  it('keeps risk levels visually distinct', () => {
    expect(statusTone('Low')).toBe('success');
    expect(statusTone('Moderate')).toBe('warning');
    expect(statusTone('High')).toBe('warning');
    expect(statusTone('Critical')).toBe('danger');
  });
});
