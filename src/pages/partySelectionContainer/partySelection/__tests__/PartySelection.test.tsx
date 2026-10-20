import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { BaseParty } from '../../../../model/Party';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../redux/store';
import { renderWithProviders } from '../../../../utils/test-utils';
import PartySelection from '../PartySelection';

vi.mock(
  '@pagopa/selfcare-common-frontend/lib/services/analyticsService',
  async (importOriginal) => ({
    ...(await importOriginal<any>()),
    trackEvent: vi.fn(),
  })
);

const parties: Array<BaseParty> = [
  { partyId: 'p1', description: 'Comune di Bari', status: 'ACTIVE', userRole: 'ADMIN' },
  { partyId: 'p2', description: 'Comune di Roma', status: 'ACTIVE', userRole: 'LIMITED' },
];

describe('PartySelection', () => {
  it('resets the selected party on mount and keeps the button disabled until a selection', () => {
    const store = createStore();
    store.dispatch(partiesActions.setPartySelected(mockedParties[0]));
    store.dispatch(partiesActions.setPartySelectedProducts([]));

    renderWithProviders(<PartySelection parties={parties} />, store);

    expect(screen.getByText('Seleziona il tuo ente')).toBeInTheDocument();
    expect(store.getState().parties.selected).toBeUndefined();
    expect(store.getState().parties.selectedProducts).toBeUndefined();
    expect(screen.getByRole('button', { name: 'Accedi' })).toBeDisabled();
  });

  it('selects a party and navigates to its dashboard', () => {
    const { history } = renderWithProviders(<PartySelection parties={parties} />);

    fireEvent.click(screen.getByText('Comune di Roma'));
    const button = screen.getByRole('button', { name: 'Accedi' });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(trackEvent).toHaveBeenCalledWith('DASHBOARD_PARTY_SELECTION', { party_id: 'p2' });
    expect(history.location.pathname).toBe('/dashboard/p2');
  });

  it('preselects the party when there is only one', () => {
    const { history } = renderWithProviders(<PartySelection parties={[parties[0]]} />);

    const button = screen.getByRole('button', { name: 'Accedi' });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(history.location.pathname).toBe('/dashboard/p1');
  });

  it('falls back to an empty partyId when the selected party has none', () => {
    const malformedParty = {
      description: 'Ente senza id',
      status: 'ACTIVE',
      userRole: 'ADMIN',
    } as unknown as BaseParty;
    const { history } = renderWithProviders(<PartySelection parties={[malformedParty]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Accedi' }));
    expect(trackEvent).toHaveBeenCalledWith('DASHBOARD_PARTY_SELECTION', { party_id: undefined });
    expect(history.location.pathname).toBe('/dashboard/');
  });
});
