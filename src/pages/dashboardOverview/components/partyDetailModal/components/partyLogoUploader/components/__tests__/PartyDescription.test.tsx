import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../../../../utils/test-utils';
import { PartyDescription } from '../PartyDescription';

describe('PartyDescription', () => {
  test('shows the upload call to action when no logo is loaded', () => {
    const open = vi.fn();
    renderWithProviders(<PartyDescription open={open} loading={false} isLoaded={false} />);

    fireEvent.click(screen.getByRole('button', { name: "Carica il logo dell'ente" }));
    expect(open).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Formato .png/)).toBeInTheDocument();
    expect(screen.queryByText('Cambia immagine')).not.toBeInTheDocument();
    expect(screen.getByText(/Inserisci solo il logo del tuo ente/)).toBeInTheDocument();
  });

  test('shows the modify call to action when a logo is loaded', () => {
    const open = vi.fn();
    renderWithProviders(<PartyDescription open={open} loading={false} isLoaded={true} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cambia immagine' }));
    expect(open).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Carica il logo dell'ente")).not.toBeInTheDocument();
  });

  test('shows the modify call to action while loading', () => {
    renderWithProviders(<PartyDescription open={vi.fn()} loading={true} isLoaded={false} />);

    expect(screen.getByRole('button', { name: 'Cambia immagine' })).toBeInTheDocument();
    expect(screen.queryByText(/Formato .png/)).not.toBeInTheDocument();
  });
});
