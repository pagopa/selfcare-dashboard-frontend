import { screen } from '@testing-library/react';
import { BaseParty } from '../../../model/Party';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { createStore } from '../../../redux/store';
import { renderWithProviders } from '../../../utils/test-utils';
import PartySelectionContainer from '../PartySelectionContainer';

vi.mock('../../../decorators/withParties', () => ({
  default: (WrappedComponent: React.ComponentType<any>) => (props: any) =>
    <WrappedComponent {...props} />,
}));

const party = (partyId: string, status: BaseParty['status']): BaseParty => ({
  partyId,
  description: `Ente ${partyId}`,
  status,
  userRole: 'ADMIN',
});

const renderWithParties = (parties?: Array<BaseParty>) => {
  const store = createStore();
  if (parties) {
    store.dispatch(partiesActions.setPartiesList(parties));
  }
  renderWithProviders(<PartySelectionContainer />, store);
};

describe('PartySelectionContainer', () => {
  it('renders nothing while the parties list is not loaded', () => {
    renderWithParties();
    expect(screen.queryByText('Seleziona il tuo ente')).not.toBeInTheDocument();
    expect(screen.queryByText('Contatta l’Assistenza.')).not.toBeInTheDocument();
  });

  it('renders the party selection when at least one party is active', () => {
    renderWithParties([party('1', 'ACTIVE'), party('2', 'PENDING')]);
    expect(screen.getByText('Seleziona il tuo ente')).toBeInTheDocument();
    expect(screen.getByText('Ente 1')).toBeInTheDocument();
  });

  it('renders NoActiveParty when parties are only pending', () => {
    renderWithParties([party('2', 'PENDING')]);
    expect(
      screen.getByText('Non risultano richieste di adesione per questo ente')
    ).toBeInTheDocument();
    expect(screen.queryByText('Seleziona il tuo ente')).not.toBeInTheDocument();
  });

  it('renders NoActiveParty when parties are only to be validated', () => {
    renderWithParties([party('5', 'TOBEVALIDATED')]);
    expect(screen.getByRole('heading', { name: /in attesa di validazione/i })).toBeInTheDocument();
  });

  it('renders NoParty when the parties list is empty', () => {
    renderWithParties([]);
    expect(screen.getByText('Contatta l’Assistenza.')).toBeInTheDocument();
  });

  it('renders an empty container when parties are neither active nor pending', () => {
    renderWithParties([party('9', 'SUSPENDED')]);
    expect(screen.queryByText('Seleziona il tuo ente')).not.toBeInTheDocument();
    expect(screen.queryByText('Contatta l’Assistenza.')).not.toBeInTheDocument();
    expect(screen.queryByText('Ente 9')).not.toBeInTheDocument();
  });
});
