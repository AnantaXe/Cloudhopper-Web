import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(cleanup);

describe('workspace navigation', () => {
  it('opens the risk evidence and architecture comparison workspaces', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);

    await user.click(screen.getByRole('button', { name: 'Risk & readiness' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Risk & readiness' })).toBeTruthy();
    expect(await screen.findByText('Evidence and factors')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Architecture designer' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Architecture designer' })).toBeTruthy();
    expect(await screen.findByText('TARGET SERVICES')).toBeTruthy();
  });
});
