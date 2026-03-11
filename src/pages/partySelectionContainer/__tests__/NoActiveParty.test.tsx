import { fireEvent, screen } from '@testing-library/react';
import { mockedBaseParties } from '../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../utils/test-utils';
import NoActiveParty from '../NoActiveParty';
test('should render with no parties in status active', () => {
  renderWithProviders(
    <NoActiveParty parties={mockedBaseParties.filter((p) => p.status === 'TOBEVALIDATED')} />
  );

  const toBeValidatedDescrition = screen.getByRole('heading', { name: /in attesa di validazione/i });
  expect(toBeValidatedDescrition).toBeInTheDocument();
});

test('should render with parties in status Pending', () => {
  renderWithProviders(
    <NoActiveParty parties={mockedBaseParties.filter((p) => p.status === 'PENDING')} />
    
  );
  const pendingDescrition = screen.getByText('Non risultano richieste di adesione per questo ente');
  expect(pendingDescrition).toBeInTheDocument();
  const closeButton = screen.getByText('Chiudi');
  expect(closeButton).toBeInTheDocument();
  fireEvent.click(closeButton);
});

test('should render with status active', () => {
  renderWithProviders(
    <NoActiveParty parties={mockedBaseParties.filter((p) => p.status === 'ACTIVE')} />
  );
});
