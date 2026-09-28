import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ValidationWorkspace } from './OperationsViews';

afterEach(cleanup);

describe('ValidationWorkspace', () => {
  it('filters the check list by validation category', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={queryClient}><ValidationWorkspace /></QueryClientProvider>);

    await screen.findByRole('heading', { name: 'Validation checks' });
    await user.click(screen.getByRole('tab', { name: 'Performance' }));

    expect(screen.getByText('Latency comparison')).toBeTruthy();
    expect(screen.queryByText('Orders API smoke check')).toBeNull();
    expect(screen.getByText('Not run')).toBeTruthy();
  });
});
