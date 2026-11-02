import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../utils/test-utils';
import { PendingRequestDialog } from '../PendingRequestDialog';

describe('PendingRequestDialog', () => {
  const renderDialog = () => {
    const onClose = vi.fn();
    const onNewRequest = vi.fn();
    renderWithProviders(
      <PendingRequestDialog open={true} onClose={onClose} onNewRequest={onNewRequest} />
    );
    return { onClose, onNewRequest };
  };

  it('renders title and message', () => {
    renderDialog();
    expect(screen.getByText('Richiesta in corso')).toBeInTheDocument();
    expect(screen.getByText(/È già presente una richiesta/)).toBeInTheDocument();
  });

  it('calls onClose from the back and close buttons', () => {
    const { onClose, onNewRequest } = renderDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Torna a Documenti' }));
    fireEvent.click(screen.getByRole('button', { name: 'Chiudi' }));
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onNewRequest).not.toHaveBeenCalled();
  });

  it('calls onNewRequest from the primary button', () => {
    const { onClose, onNewRequest } = renderDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Inizia nuova richiesta' }));
    expect(onNewRequest).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});
