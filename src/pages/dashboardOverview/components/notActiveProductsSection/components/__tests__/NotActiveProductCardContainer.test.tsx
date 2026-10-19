import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { ProductOnBoardingStatusEnum } from '../../../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { OnboardedProduct, Party } from '../../../../../../model/Party';
import { Product } from '../../../../../../model/Product';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import NotActiveProductCardContainer from '../NotActiveProductCardContainer';

const { mockAddNotify, mockAddError } = vi.hoisted(() => ({
  mockAddNotify: vi.fn(),
  mockAddError: vi.fn(),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@pagopa/selfcare-common-frontend/lib')>()),
  useUserNotify: () => mockAddNotify,
  useErrorDispatcher: () => mockAddError,
}));
vi.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService');

const findProduct = (id: string) => mockedPartyProducts.find((p) => p.id === id) as Product;

const buildParty = (
  products: Array<Partial<OnboardedProduct>>,
  overrides: Partial<Party> = {}
): Party => ({
  ...mockedParties[0],
  partyId: 'party-id',
  externalId: 'external-id',
  fiscalCode: 'FISCAL',
  subunitCode: undefined,
  subunitType: undefined,
  products: products as Array<OnboardedProduct>,
  ...overrides,
});

describe('NotActiveProductCardContainer', () => {
  const fetchMock = vi.fn();
  const assignMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('location', {
      ...window.location,
      href: 'http://localhost/',
      assign: assignMock,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const clickJoin = () => fireEvent.click(screen.getByRole('button', { name: 'Aderisci' }));

  test('goes to the onboarding of the product when there is no pending onboarding', async () => {
    fetchMock.mockResolvedValue({ status: 204 });
    const party = buildParty([], { subunitType: 'UO', subunitCode: 'UO1' });
    renderWithProviders(
      <NotActiveProductCardContainer party={party} product={findProduct('prod-pn')} />
    );

    expect(screen.getByText('SEND - Servizio Notifiche Digitali')).toBeInTheDocument();
    clickJoin();

    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        'http://selfcare/onboarding/prod-pn?partyExternalId=external-id&subunitType=UO&subunitCode=UO1'
      )
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.selfcare/dashboard/v2/institutions/onboardings/prod-pn/pending?taxCode=FISCAL&subunitCode=UO1',
      expect.objectContaining({ method: 'GET' })
    );
    expect(trackEvent).not.toHaveBeenCalled();
  });

  test('proposes the IO premium sub product when the base product is onboarded', async () => {
    fetchMock.mockResolvedValue({ status: 204 });
    const party = buildParty([
      { productId: 'prod-io', productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE },
    ]);
    renderWithProviders(
      <NotActiveProductCardContainer party={party} product={findProduct('prod-io')} />
    );

    expect(screen.getByText('IO')).toBeInTheDocument();
    expect(screen.getByText(/Premium/)).toBeInTheDocument();
    clickJoin();

    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        'http://selfcare/onboarding/prod-io/prod-io-premium?partyId=party-id'
      )
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/onboardings/prod-io-premium/pending?taxCode=FISCAL'),
      expect.anything()
    );
    expect(trackEvent).toHaveBeenCalledWith('PREMIUM_CTA_JOIN', expect.any(Object));
  });

  test('asks confirmation when an onboarding is already pending', async () => {
    fetchMock.mockResolvedValue({ status: 200 });
    const party = buildParty([
      { productId: 'prod-pagopa', productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE },
    ]);
    renderWithProviders(
      <NotActiveProductCardContainer party={party} product={findProduct('prod-pagopa')} />
    );

    // non PSP institutions cannot join the PSP dashboard sub product
    expect(screen.getByText('Pagamenti pagoPA')).toBeInTheDocument();
    clickJoin();

    await waitFor(() =>
      expect(mockAddNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Adesione in corso', component: 'SessionModal' })
      )
    );
    expect(assignMock).not.toHaveBeenCalled();

    mockAddNotify.mock.calls[0][0].onConfirm();
    expect(assignMock).toHaveBeenCalledWith(
      'http://selfcare/onboarding/prod-pagopa?partyExternalId=external-id'
    );
  });

  test('notifies an error when the onboarding status cannot be retrieved', async () => {
    fetchMock.mockResolvedValue({ status: 500 });
    const party = buildParty([]);
    renderWithProviders(
      <NotActiveProductCardContainer party={party} product={findProduct('prod-ciban')} />
    );

    clickJoin();

    await waitFor(() =>
      expect(mockAddError).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'OnboardingStatusError-prod-ciban', toNotify: true })
      )
    );
    expect(assignMock).not.toHaveBeenCalled();
  });
});
