import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MigrationOverview } from './MigrationOverview';

afterEach(cleanup);

describe('MigrationOverview', () => {
  it('shows dependencies, prerequisites, durations, and rollback checkpoints', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={queryClient}><MigrationOverview /></QueryClientProvider>);

    expect(await screen.findByText(/JDBC compatibility confirmed/)).toBeTruthy();
    expect(screen.getByText(/Core network foundation, Identity service/)).toBeTruthy();
    expect(screen.getByText('Keep source database writable until cutover approval')).toBeTruthy();
    expect(screen.getByText('4 days')).toBeTruthy();
  });
});
