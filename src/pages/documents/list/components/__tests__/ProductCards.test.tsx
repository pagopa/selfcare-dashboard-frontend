import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { fireEvent, screen, within } from '@testing-library/react';
import { ProductOnBoardingStatusEnum } from '../../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import {
  StatusEnum,
  SubProductResource,
} from '../../../../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { createStore } from '../../../../../redux/store';
import { ProductContractUpdateStatus } from '../../../../../services/contractUpdateService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import ProductCards from '../ProductCards';
import { getDocumentProducts } from '../../productUtils';

vi.mock(
  '@pagopa/selfcare-common-frontend/lib/services/analyticsService',
  async (importOriginal) => ({
    ...(await importOriginal<any>()),
    trackEvent: vi.fn(),
  })
);

const VIEW_CONTRACT = 'Selc:ViewContract';
const UPDATE_CONTRACT = 'Selc:UpdateContract';

const buildProduct = (id: string, overrides: Partial<Product> = {}): Product => ({
  id,
  title: `Title ${id}`,
  description: '',
  logo: `logo-${id}`,
  urlBO: '',
  status: StatusEnum.ACTIVE,
  imageUrl: '',
  delegable: false,
  contractEnabled: true,
  ...overrides,
});

const subProduct = (id: string, status = StatusEnum.ACTIVE): SubProductResource => ({
  id,
  title: `Title ${id}`,
  status,
  logo: `logo-${id}`,
  contractEnabled: true,
});

const products: Array<Product> = [
  buildProduct('prod-io', { subProducts: [subProduct('prod-io-premium')] }),
  buildProduct('prod-pagopa', { title: 'pagoPA' }),
  buildProduct('prod-dashboard-psp'),
  buildProduct('prod-pn', { subProducts: [subProduct('prod-pn-sub')] }),
  buildProduct('prod-inactive', { status: StatusEnum.INACTIVE }),
  buildProduct('prod-noperm'),
  buildProduct('prod-no-contract', { contractEnabled: false }),
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
    onboarded('prod-no-contract'),
  ],
};

const setup = (
  statuses: Array<ProductContractUpdateStatus> = [],
  permissionProductIds = ['prod-io', 'prod-pagopa', 'prod-dashboard-psp', 'prod-pn', 'prod-inactive'],
  selectedParty = party,
  updatePermissionProductIds = permissionProductIds
) => {
  const store = createStore();
  store.dispatch(
    setProductPermissions(
      permissionProductIds.map((productId) => ({
        productId,
        actions: updatePermissionProductIds.includes(productId)
          ? [VIEW_CONTRACT, UPDATE_CONTRACT]
          : [VIEW_CONTRACT],
      }))
    )
  );
  return renderWithProviders(
    <ProductCards
      party={selectedParty}
      products={products}
      documentProducts={getDocumentProducts(selectedParty, products)}
      statuses={statuses}
    />,
    store
  );
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
    // not eligible: inactive product, pending onboarding
    expect(screen.queryByText('Title prod-inactive')).not.toBeInTheDocument();
    expect(screen.queryByText('Title prod-no-contract')).not.toBeInTheDocument();
    expect(screen.getByText('Title prod-noperm')).toBeInTheDocument();
    expect(
      screen.getByText('Altri prodotti attivi per il tuo ente (non gestibili dal tuo profilo)')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Vedi di più')).toHaveLength(3);

    const productWithoutPermission = screen.getByText('Title prod-noperm').closest('.MuiCard-root');
    expect(productWithoutPermission).not.toBeNull();
    expect(within(productWithoutPermission as HTMLElement).queryByRole('button')).toBeNull();
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

  it('shows the missing-document banner and starts the contract update for its parent product', () => {
    const { history } = setup([
      {
        productId: 'prod-io',
        contractUpdateRequired: true,
        contractUpdateInProgress: false,
      },
    ]);

    expect(screen.getByRole('alert')).toHaveTextContent('Completa la documentazione');
    expect(screen.getByText('Completa la documentazione')).toBeInTheDocument();
    expect(screen.getByText('Documento da completare').closest('.MuiChip-root')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Completa documento' }));

    expect(history.location.pathname).toBe('/dashboard/party-1/documents/prod-io/update-contract');
  });

  it('opens the pending-request dialog when a contract update is already in progress', () => {
    setup([
      {
        productId: 'prod-io',
        contractUpdateRequired: true,
        contractUpdateInProgress: true,
      },
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Completa documento' }));
    expect(screen.getByRole('dialog', { name: 'Richiesta in corso' })).toBeInTheDocument();
  });

  it('shows View more for a missing document without update permission', () => {
    const { history } = setup(
      [{ productId: 'prod-io', contractUpdateRequired: true, contractUpdateInProgress: false }],
      ['prod-io'],
      party,
      []
    );

    expect(screen.queryByRole('button', { name: 'Completa documento' })).not.toBeInTheDocument();
    const viewButton = screen.getByRole('button', { name: 'Vedi di più' });
    expect(viewButton).toBeEnabled();
    fireEvent.click(viewButton);
    expect(history.location.pathname).toBe('/dashboard/party-1/documents/details');
    expect(history.location.search).toContain('productId=prod-io&subProductId=prod-io-premium');
  });

  it('uses child permission for document access but requires parent permission for updates', () => {
    const childOnlyParty = {
      ...party,
      products: party.products.filter(({ productId }) => productId !== 'prod-io'),
    };
    const { history } = setup(
      [
        {
          productId: 'prod-io',
          contractUpdateRequired: true,
          contractUpdateInProgress: false,
        },
      ],
      ['prod-io-premium'],
      childOnlyParty
    );

    const childCard = screen.getByText('Title prod-io-premium').closest('.MuiCard-root');
    expect(childCard).not.toBeNull();
    fireEvent.click(within(childCard as HTMLElement).getByRole('button', { name: 'Vedi di più' }));

    expect(history.location.search).toBe(
      '?productId=prod-io&subProductId=prod-io-premium&productTitle=Title%20prod-io-premium'
    );
    expect(history.location.pathname).toBe('/dashboard/party-1/documents/details');
  });
});
