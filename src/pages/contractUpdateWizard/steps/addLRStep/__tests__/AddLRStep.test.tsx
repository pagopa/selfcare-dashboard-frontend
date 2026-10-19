import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route } from 'react-router-dom';
import { Product } from '../../../../../model/Product';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../redux/store';
import { renderWithProviders } from '../../../../../utils/test-utils';
import { ContractUpdateWizardProvider } from '../../../ContractUpdateWizardContext';
import { AddLRStep } from '../AddLRStep';

test('renders the description with the product name, the roles link and the form fields', () => {
  const store = createStore();
  store.dispatch(
    partiesActions.setPartySelectedProducts([{ id: 'prod-io', title: 'IO' } as Product])
  );
  renderWithProviders(
    <Route path="/:partyId/:productId">
      <ContractUpdateWizardProvider>
        <AddLRStep />
      </ContractUpdateWizardProvider>
    </Route>,
    store,
    createMemoryHistory({ initialEntries: ['/party-1/prod-io'] })
  );

  expect(screen.getByText(/firma del contratto per IO e avrà il ruolo/)).toBeInTheDocument();
  const link = screen.getByRole('link', { name: 'Più informazioni sui ruoli' });
  expect(link).toHaveAttribute(
    'href',
    'https://docs.pagopa.it/area-riservata/area-riservata/ruoli'
  );
  expect(link).toHaveAttribute('target', '_blank');
  ['Nome', 'Cognome', 'Codice Fiscale', 'Email istituzionale'].forEach((label) =>
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-required', 'true')
  );
  expect(screen.getByLabelText('Email istituzionale')).toHaveAccessibleDescription(
    'Inserisci l’indirizzo email istituzionale utilizzato per l’ente. Non sono ammessi gli indirizzi PEC.'
  );
});
