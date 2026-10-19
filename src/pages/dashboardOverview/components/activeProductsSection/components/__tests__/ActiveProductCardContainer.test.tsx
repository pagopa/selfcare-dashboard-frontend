import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';
import { ProductOnBoardingStatusEnum } from '../../../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { OnboardedProduct, Party } from '../../../../../../model/Party';
import { createStore } from '../../../../../../redux/store';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import ActiveProductCardContainer from '../ActiveProductCardContainer';

const mockInvokeProductBo = vi.hoisted(() => vi.fn());

vi.mock('../../../../../../hooks/useTokenExchange', () => ({
  useTokenExchange: () => ({ invokeProductBo: mockInvokeProductBo }),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@pagopa/selfcare-common-frontend/lib/utils/storage')>()),
  isPagoPaUser: vi.fn(() => false),
}));

const findProduct = (id: string) => mockedPartyProducts.find((p) => p.id === id)!;

const onboarded = (productId: string): OnboardedProduct => ({
  productId,
  productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
  authorized: true,
  institutionType: 'PA',
});

const buildParty = (productIds: Array<string>, userRole: Party['userRole'] = 'ADMIN'): Party => ({
  ...mockedParties[0],
  userRole,
  products: productIds.map(onboarded),
});

const renderContainer = ({
  party,
  product,
  permissions = [],
  hasMoreThanOneInteropEnv = false,
  authorizedInteropProducts = [],
}: {
  party: Party;
  product: OnboardedProduct;
  permissions?: Array<{ productId: string; actions: Array<string> }>;
  hasMoreThanOneInteropEnv?: boolean;
  authorizedInteropProducts?: Array<string>;
}) => {
  const store = createStore();
  store.dispatch(setProductPermissions(permissions));
  return renderWithProviders(
    <ActiveProductCardContainer
      party={party}
      product={product}
      hasMoreThanOneInteropEnv={hasMoreThanOneInteropEnv}
      products={mockedPartyProducts}
      authorizedInteropProducts={authorizedInteropProducts}
    />,
    store
  );
};

describe('ActiveProductCardContainer', () => {
  beforeEach(() => {
    (isPagoPaUser as Mock).mockReturnValue(false);
  });

  test('renders nothing when the product is not in the catalog', () => {
    const party = buildParty(['prod-unknown']);
    renderContainer({ party, product: party.products[0] });

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('renders nothing for a limited user without backoffice permission', () => {
    const party = buildParty(['prod-pn'], 'LIMITED');
    renderContainer({ party, product: party.products[0] });

    expect(screen.queryByText('SEND - Servizio Notifiche Digitali')).not.toBeInTheDocument();
  });

  test('renders a disabled card when the user cannot access the backoffice', () => {
    const party = buildParty(['prod-pn']);
    renderContainer({ party, product: party.products[0] });

    expect(screen.getByText('SEND - Servizio Notifiche Digitali')).toBeInTheDocument();
    expect(screen.getByText('Non hai un ruolo per gestire questo prodotto')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('invokes the product backoffice directly for products without environments', () => {
    const party = buildParty(['prod-pn']);
    renderContainer({
      party,
      product: party.products[0],
      permissions: [{ productId: 'prod-pn', actions: [Actions.AccessProductBackoffice] }],
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Accedi alla piattaforma del prodotto SEND - Servizio Notifiche Digitali',
      })
    );

    expect(mockInvokeProductBo).toHaveBeenCalledWith(
      findProduct('prod-pn'),
      party,
      undefined,
      'it'
    );
  });

  test('opens the environment modal for products with backoffice environments', async () => {
    const party = buildParty(['prod-pagopa']);
    renderContainer({
      party,
      product: party.products[0],
      permissions: [{ productId: 'prod-pagopa', actions: [Actions.AccessProductBackoffice] }],
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Accedi alla piattaforma del prodotto Pagamenti pagoPA' })
    );

    expect(await screen.findByText('In quale ambiente vuoi entrare?')).toBeInTheDocument();
    expect(mockInvokeProductBo).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Test1'));
    fireEvent.click(screen.getByRole('button', { name: 'Entra' }));

    expect(mockInvokeProductBo).toHaveBeenCalledWith(
      findProduct('prod-pagopa'),
      party,
      'Test1',
      'it'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Annulla' }));
    await waitFor(() =>
      expect(screen.queryByText('In quale ambiente vuoi entrare?')).not.toBeInTheDocument()
    );
  });

  test('opens the interop environment modal when more interop environments are authorized', async () => {
    const party = buildParty(['prod-interop', 'prod-interop-coll']);
    renderContainer({
      party,
      product: party.products[1],
      hasMoreThanOneInteropEnv: true,
      authorizedInteropProducts: ['prod-interop', 'prod-interop-coll'],
    });

    // card uses interop production title and is enabled even without explicit permission
    expect(screen.getByText('Interoperabilità')).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Accedi alla piattaforma del prodotto Interoperabilità Collaudo',
      })
    );

    expect(await screen.findByText('In quale ambiente vuoi entrare?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ambiente di Produzione'));
    fireEvent.click(screen.getByRole('button', { name: 'Entra' }));

    expect(mockInvokeProductBo).toHaveBeenCalledWith(
      findProduct('prod-interop'),
      party,
      undefined,
      'it'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Annulla' }));
    await waitFor(() =>
      expect(screen.queryByText('In quale ambiente vuoi entrare?')).not.toBeInTheDocument()
    );
  });

  test('opens the backoffice not integrated modal for PagoPA users on not allowed products', async () => {
    (isPagoPaUser as Mock).mockReturnValue(true);
    const party = buildParty(['prod-pn']);
    renderContainer({
      party,
      product: party.products[0],
      permissions: [{ productId: 'prod-pn', actions: [Actions.AccessProductBackoffice] }],
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Accedi alla piattaforma del prodotto SEND - Servizio Notifiche Digitali',
      })
    );

    expect(
      await screen.findByText('Il back-office non è ancora integrato in Area Riservata Backstage.')
    ).toBeInTheDocument();
    expect(mockInvokeProductBo).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    await waitFor(() =>
      expect(
        screen.queryByText('Il back-office non è ancora integrato in Area Riservata Backstage.')
      ).not.toBeInTheDocument()
    );
  });
});
