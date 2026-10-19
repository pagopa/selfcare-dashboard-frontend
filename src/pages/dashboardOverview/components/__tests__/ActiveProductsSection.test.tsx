import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { screen } from '@testing-library/react';
import { OnboardedProduct, Party } from '../../../../model/Party';
import { createStore } from '../../../../redux/store';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import ActiveProductsSection from '../activeProductsSection/ActiveProductsSection';

const buildParty = (products: Array<[string, string]>): Party => ({
  ...mockedParties[0],
  userRole: 'ADMIN',
  products: products.map(
    ([productId, productOnBoardingStatus]) =>
      ({ productId, productOnBoardingStatus, institutionType: 'PA' } as OnboardedProduct)
  ),
});

const renderSection = (
  party: Party,
  permissions: Array<{ productId: string; actions: Array<string> }>
) => {
  const store = createStore();
  store.dispatch(setProductPermissions(permissions));
  renderWithProviders(
    <ActiveProductsSection party={party} products={mockedPartyProducts} />,
    store
  );
};

const cardIds = () => Array.from(document.querySelectorAll('.MuiCard-root')).map((c) => c.id);

test('should render component ActiveProductsSection empty props', () => {
  renderWithProviders(<ActiveProductsSection party={mockedParties[4]} products={[]} />);
  expect(screen.getByText('Prodotti attivi')).toBeInTheDocument();
  expect(cardIds()).toEqual([]);
});

test('shows only active products, placing those without backoffice permission last', () => {
  const party = buildParty([
    ['prod-pn', 'ACTIVE'],
    ['prod-io', 'ACTIVE'],
    ['prod-pagopa', 'PENDING'],
    ['prod-ciban', 'ACTIVE'],
  ]);
  renderSection(party, [
    { productId: 'prod-io', actions: [Actions.AccessProductBackoffice] },
    { productId: 'prod-ciban', actions: [Actions.AccessProductBackofficeAdmin] },
  ]);

  expect(cardIds()).toEqual(['prod-io', 'prod-ciban', 'prod-pn']);
});

test('shows a single interop card for the first authorized interop environment', () => {
  const party = buildParty([
    ['prod-interop', 'ACTIVE'],
    ['prod-interop-coll', 'ACTIVE'],
    ['prod-interop-atst', 'ACTIVE'],
  ]);
  renderSection(party, [
    { productId: 'prod-interop-coll', actions: [Actions.AccessProductBackoffice] },
    { productId: 'prod-interop-atst', actions: [Actions.AccessProductBackoffice] },
  ]);

  expect(cardIds()).toEqual(['prod-interop-coll']);
  // more than one interop env authorized: the card is enabled
  expect(
    screen.getByRole('button', {
      name: 'Accedi alla piattaforma del prodotto Interoperabilità Collaudo',
    })
  ).toBeEnabled();
});

test('shows the first active interop product when none is authorized', () => {
  const party = buildParty([
    ['prod-interop-coll', 'PENDING'],
    ['prod-interop', 'ACTIVE'],
    ['prod-interop-atst', 'ACTIVE'],
  ]);
  renderSection(party, []);

  expect(cardIds()).toEqual(['prod-interop']);
  expect(screen.getByText('Non hai un ruolo per gestire questo prodotto')).toBeInTheDocument();
});

test('ignores onboarded products without productId', () => {
  const baseParty = buildParty([['prod-io', 'ACTIVE']]);
  const party: Party = {
    ...baseParty,
    products: [...baseParty.products, { productOnBoardingStatus: 'ACTIVE' } as OnboardedProduct],
  };
  renderSection(party, [{ productId: 'prod-io', actions: [Actions.AccessProductBackoffice] }]);

  expect(cardIds()).toEqual(['prod-io']);
});
