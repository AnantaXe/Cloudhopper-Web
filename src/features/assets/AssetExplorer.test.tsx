import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { AssetExplorer } from './AssetExplorer';

afterEach(cleanup);

function renderAssetExplorer() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AssetExplorer
        initialSearch=""
        environment="All environments"
        onEnvironmentChange={() => undefined}
        onSearchChange={() => undefined}
        onOpenDependencies={() => undefined}
      />
    </QueryClientProvider>,
  );
}

describe('AssetExplorer', () => {
  it('filters the inventory by resource type', async () => {
    const user = userEvent.setup();
    renderAssetExplorer();

    await screen.findByRole('heading', { name: /Infrastructure assets/ });
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by type' }), 'Database');

    await waitFor(() => {
      expect(screen.getByRole('row', { name: /orders-primary/ })).toBeTruthy();
      expect(screen.queryByRole('row', { name: /Orders API/ })).toBeNull();
    });
  });

  it('applies the selected environment to the visible inventory', async () => {
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <AssetExplorer
          initialSearch=""
          environment="Staging"
          onEnvironmentChange={() => undefined}
          onSearchChange={() => undefined}
          onOpenDependencies={() => undefined}
        />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole('row', { name: /catalog-stg-01/ })).toBeTruthy();
    expect(screen.queryByRole('row', { name: /orders-prod-01/ })).toBeNull();
  });
});
