import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { ArchitectureDesigner } from './PlanningViews';

afterEach(cleanup);

function renderWithQueries(element: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{element}</QueryClientProvider>);
}

describe('ArchitectureDesigner', () => {
  it('updates the topology and tradeoffs when comparing options', async () => {
    const user = userEvent.setup();
    renderWithQueries(<ArchitectureDesigner />);

    await screen.findByText('Managed container runtime');
    await user.click(screen.getByRole('button', { name: /Kubernetes platform/ }));

    expect(screen.getAllByText('Managed Kubernetes').length).toBeGreaterThan(0);
    expect(screen.getByText('Requires cluster operations and platform ownership')).toBeTruthy();
  });
});
