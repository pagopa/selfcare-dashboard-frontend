import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { fireEvent, screen } from '@testing-library/react';
import { ProductOnBoardingStatusEnum } from '../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { StatusEnum } from '../../../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { createStore } from '../../../../redux/store';
import { renderWithProviders } from '../../../../utils/test-utils';
import ProductCards from '../ProductCards';

vi.mock(
  '@pagopa/selfcare-common-frontend/lib/services/analyticsService',
  async (importOriginal) => ({
    ...(await importOriginal<any>()),
    trackEvent: vi.fn(),
  })
);

const VIEW_CONTRACT = 'Selc:ViewContract';

const buildProduct = (id: string, overrides: Partial<Product> = {}): Product => ({
  id,
  title: `Title ${id}`,
  description: '',
  logo: `logo-${id}`,
  urlBO: '',
  status: StatusEnum.ACTIVE,
  imageUrl: '',
  delegable: false,
  ...overrides,
});

const subProduct = (id: string, status = StatusEnum.ACTIVE) =>
  ({ id, title: `Title ${id}`, status, logo: `logo-${id}` } as any);

const products: Array<Product> = [
  buildProduct('prod-io', { subProducts: [subProduct('prod-io-premium')] }),
  buildProduct('prod-pagopa', { title: 'pagoPA' }),
  buildProduct('prod-dashboard-psp'),
  buildProduct('prod-pn', { subProducts: [subProduct('prod-pn-sub')] }),
  buildProduct('prod-inactive', { status: StatusEnum.INACTIVE }),
  buildProduct('prod-noperm'),
];

const onboarded = (productId: string, status = ProductOnBoardingStatusEnum.ACTIVE) => ({
  productId,
  productOnBoardingStatus: status,
  userRole: 'ADMIN',
});

const party: Party = {
  partyId: 'party-1',
  description: 'Ente',
  registeredOffice: '',
  typology: 'PA',
  products: [
    onboarded('prod-io'),
    onboarded('prod-io-premium'),
    onboarded('prod-pagopa', ProductOnBoardingStatusEnum.PENDING),
    onboarded('prod-dashboard-psp'),
    onboarded('prod-pn'),
    onboarded('prod-pn-sub', ProductOnBoardingStatusEnum.PENDING),
    onboarded('prod-inactive'),
    onboarded('prod-noperm'),
  ],
};

const setup = () => {
  const store = createStore();
  store.dispatch(
    setProductPermissions(
      ['prod-io', 'prod-pagopa', 'prod-dashboard-psp', 'prod-pn', 'prod-inactive'].map(
        (productId) => ({ productId, actions: [VIEW_CONTRACT] })
      )
    )
  );
  return renderWithProviders(<ProductCards party={party} products={products} />, store);
};

describe('ProductCards', () => {
  it('shows only eligible products, preferring the active sub product', () => {
    setup();

    // prod-io is replaced by its active sub product
    expect(screen.getByText('Title prod-io-premium')).toBeInTheDocument();
    expect(screen.queryByText('Title prod-io')).not.toBeInTheDocument();
    // dashboard psp uses the pagoPA title and logo
    expect(screen.getByText('pagoPA')).toBeInTheDocument();
    expect(screen.getByAltText('Title prod-dashboard-psp logo')).toHaveAttribute(
      'src',
      'logo-prod-pagopa'
    );
    // prod-pn sub product is not active, the base product is shown
    expect(screen.getByText('Title prod-pn')).toBeInTheDocument();
    // not eligible: inactive product, pending onboarding, missing permission
    expect(screen.queryByText('Title prod-inactive')).not.toBeInTheDocument();
    expect(screen.queryByText('Title prod-noperm')).not.toBeInTheDocument();
    expect(screen.getAllByText('Vedi di più')).toHaveLength(3);
  });

  it('navigates to the sub product detail with the parent product id', () => {
    const { history } = setup();

    fireEvent.click(screen.getAllByText('Vedi di più')[0]);

    expect(trackEvent).toHaveBeenCalledWith('DASHBOARD_OPEN_PRODUCT_DOCUMENT', {
      product_role: 'ADMIN',
      product_id: 'prod-io-premium',
      party_id: 'party-1',
    });
    expect(history.location.pathname).toBe('/dashboard/party-1/documents/details');
    expect(history.location.search).toBe(
      '?productId=prod-io&subProductId=prod-io-premium&productTitle=Title%20prod-io-premium'
    );
  });

  it('navigates to the dashboard psp detail using the pagoPA title', () => {
    const { history } = setup();

    fireEvent.click(screen.getAllByText('Vedi di più')[1]);

    expect(history.location.search).toBe('?productId=prod-dashboard-psp&productTitle=pagoPA');
  });

  it('navigates to a base product without an active sub product', () => {
    const { history } = setup();

    fireEvent.click(screen.getAllByText('Vedi di più')[2]);

    expect(history.location.search).toBe('?productId=prod-pn&productTitle=Title%20prod-pn');
  });
});
