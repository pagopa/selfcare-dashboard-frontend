import { fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { renderWithProviders } from '../../../../utils/test-utils';
import { PendingRequestDialog } from '../PendingRequestDialog';

describe('PendingRequestDialog', () => {
  const documentsPath = '/dashboard/party-1/documents';

  const renderDialog = () => {
    const onClose = vi.fn();
    const history = createMemoryHistory({ initialEntries: [`${documentsPath}?tab=1#product-1`] });
    renderWithProviders(
      <PendingRequestDialog open={true} partyId="party-1" productId="prod-io" onClose={onClose} />,
      undefined,
      history
    );
    return { onClose, history };
  };

  it('renders title and message', () => {
    renderDialog();
    expect(screen.getByText('Richiesta in corso')).toBeInTheDocument();
    expect(screen.getByText(/È già presente una richiesta/)).toBeInTheDocument();
  });

  it('calls onClose from the back and close buttons', () => {
    const { onClose, history } = renderDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Torna a Documenti' }));
    fireEvent.click(screen.getByRole('button', { name: 'Chiudi' }));
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(history.location.pathname).toBe(documentsPath);
  });

  it('starts the contract update wizard from the primary button', () => {
    const { onClose, history } = renderDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Inizia nuova richiesta' }));
    expect(history.location.pathname).toBe('/dashboard/party-1/documents/prod-io/update-contract');
    expect(history.location.state).toEqual({ returnTo: `${documentsPath}?tab=1#product-1` });
    expect(onClose).not.toHaveBeenCalled();
  });
});
