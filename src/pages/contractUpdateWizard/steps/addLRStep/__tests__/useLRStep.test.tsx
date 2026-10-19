import { act, renderHook } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { Product } from '../../../../../model/Product';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../redux/store';
import { ContractUpdateWizardProvider } from '../../../ContractUpdateWizardContext';
import { useLRStep } from '../useLRStep';

const renderLRStep = (products?: Array<Product>) => {
  const store = createStore();
  if (products) {
    store.dispatch(partiesActions.setPartySelectedProducts(products));
  }
  const history = createMemoryHistory({ initialEntries: ['/party-1/prod-io'] });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/:partyId/:productId">
          <ContractUpdateWizardProvider>{children}</ContractUpdateWizardProvider>
        </Route>
      </Router>
    </Provider>
  );
  return renderHook(() => useLRStep(), { wrapper });
};

const field = (result: ReturnType<typeof renderLRStep>['result'], id: string) =>
  result.current.fields.find((f) => f.id === id)!;

test('exposes the product name and the roles documentation link', () => {
  const { result } = renderLRStep([{ id: 'prod-io', title: 'IO' } as Product]);
  expect(result.current.productName).toBe('IO');
  expect(result.current.rolesInfoUrl).toBe(
    'https://docs.pagopa.it/area-riservata/area-riservata/ruoli'
  );
});

test('falls back to the productId when the product is not loaded', () => {
  const { result } = renderLRStep();
  expect(result.current.productName).toBe('prod-io');
});

test('updates the shared draft and shows only non-required errors while typing', () => {
  const { result } = renderLRStep();
  expect(result.current.fields.map((f) => f.id)).toEqual(['name', 'surname', 'taxCode', 'email']);
  expect(result.current.fields.every((f) => f.error === undefined)).toBe(true);
  expect(field(result, 'email').hint).toBe(
    'Inserisci l’indirizzo email istituzionale utilizzato per l’ente. Non sono ammessi gli indirizzi PEC.'
  );

  act(() => field(result, 'taxCode').onChange('INVALID'));
  act(() => field(result, 'email').onChange('mario@pec.it'));

  expect(field(result, 'taxCode').value).toBe('INVALID');
  expect(field(result, 'taxCode').error).toBe('Il Codice Fiscale inserito non è valido');
  expect(field(result, 'email').error).toBe(
    'Indirizzo PEC non accettato. Inserisci l’indirizzo email istituzionale utilizzato per l’ente'
  );
  expect(field(result, 'name').error).toBeUndefined();
});

test('always stores the tax code in uppercase', () => {
  const { result } = renderLRStep();
  act(() => field(result, 'taxCode').onChange('rssmra80a01h501u'));
  expect(field(result, 'taxCode').value).toBe('RSSMRA80A01H501U');
  act(() => field(result, 'name').onChange('Mario'));
  expect(field(result, 'name').value).toBe('Mario');
});
