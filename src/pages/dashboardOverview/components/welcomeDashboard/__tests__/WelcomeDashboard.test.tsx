import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { fireEvent, screen } from '@testing-library/react';
import { Mock } from 'vitest';
import { renderWithProviders } from '../../../../../utils/test-utils';
import WelcomeDashboard from '../WelcomeDashboard';

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@pagopa/selfcare-common-frontend/lib/utils/storage')>()),
  isPagoPaUser: vi.fn(() => false),
}));

describe('WelcomeDashboard', () => {
  test('renders the edit details button for institution users', () => {
    (isPagoPaUser as Mock).mockReturnValue(false);
    const setOpen = vi.fn();
    renderWithProviders(<WelcomeDashboard setOpen={setOpen} />);

    expect(screen.getByText('Panoramica')).toBeInTheDocument();
    expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Gestisci i dati dell’ente' }));
    expect(setOpen).toHaveBeenCalledWith(true);
  });

  test('renders the view details button and backstage subtitle for PagoPA users', () => {
    (isPagoPaUser as Mock).mockReturnValue(true);
    const setOpen = vi.fn();
    renderWithProviders(<WelcomeDashboard setOpen={setOpen} />);

    expect(
      screen.getByText("Consulta le informazioni dell'ente e accedi al backoffice dei prodotti")
    ).toBeInTheDocument();
    expect(screen.getByTestId('VisibilityIcon')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Vedi i dati dell’ente' }));
    expect(setOpen).toHaveBeenCalledWith(true);
  });
});
