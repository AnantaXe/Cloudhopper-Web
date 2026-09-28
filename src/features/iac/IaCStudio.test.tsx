import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { IaCStudio } from './IaCStudio';

afterEach(cleanup);

describe('IaCStudio', () => {
  it('keeps editor changes local and does not imply validation succeeded', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={queryClient}><IaCStudio /></QueryClientProvider>);

    const editor = await screen.findByRole('textbox', { name: 'Edit terraform/main.tf' });
    await user.clear(editor);
    await user.type(editor, 'resource demo block');

    expect(screen.getByText('Local draft · not saved')).toBeTruthy();
    expect(screen.getAllByText('Not run')).toHaveLength(2);
  });
});
