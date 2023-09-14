import { fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardOverview from '../DashboardOverview';
import '../../../locale';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

test('should render component DashboardOverview with empty party', async () => {
  renderWithProviders(
    <DashboardOverview
      party={{
        partyId: '',
        products: [],
        externalId: undefined,
        originId: undefined,
        origin: undefined,
        description: '',
        digitalAddress: undefined,
        category: undefined,
        urlLogo: undefined,
        fiscalCode: undefined,
        registeredOffice: '',
        zipCode: '',
        typology: '',
        institutionType: undefined,
        recipientCode: undefined,
        geographicTaxonomies: [],
        vatNumberGroup: undefined,
        supportEmail: undefined,
        vatNumber: undefined,
        subunitCode: undefined,
        subunitType: undefined,
        aooParentCode: undefined,
        parentDescription: undefined,
        userRole: undefined,
        status: undefined,
      }}
      products={[]}
    />
  );

  // info section is not visible
  expect(screen.queryByTestId('InfoOutlinedIcon')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with populated props and product prod-pagopa and institutionType GSP', async () => {
  const mockedGsp = mockedParties[11];
  const { history } = renderWithProviders(<DashboardOverview party={mockedGsp} products={mockedPartyProducts} />);

  const delegationBanner = await screen.findByText('Delega la gestione dei prodotti a un Partner o a un Intermediario');
  expect(delegationBanner).toBeInTheDocument();

  fireEvent.click(await screen.findByText('Vai'));

  expect(history.location.pathname).toBe(`/dashboard/9/delegations`);

  // info section is not visible
  expect(screen.queryByTestId('InfoOutlinedIcon')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with populated props and product prod-io and institutionType PA', async () => {
  const mockedPa = mockedParties[1];
  renderWithProviders(<DashboardOverview party={mockedPa} products={mockedPartyProducts} />);

  // info section is visible for PA
  expect(await screen.findByTestId('InfoOutlinedIcon')).toBeInTheDocument();
});
