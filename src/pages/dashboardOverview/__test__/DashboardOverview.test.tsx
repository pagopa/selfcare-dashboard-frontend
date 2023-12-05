import { fireEvent, screen } from '@testing-library/react';
import '../../../locale';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardOverview from '../DashboardOverview';

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
  const { history } = renderWithProviders(
    <DashboardOverview party={mockedGsp} products={mockedPartyProducts} />
  );

  const delegationBanner = await screen.findByText(
    'Delega la gestione dei prodotti a un Partner o a un Intermediario'
  );
  expect(delegationBanner).toBeInTheDocument();

  fireEvent.click(await screen.findByText('Vai'));

  expect(history.location.pathname).toBe(`/dashboard/13/delegations`);

  // info section is not visible
  expect(screen.queryByTestId('InfoOutlinedIcon')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with institutionType SA and Product Avaible section should not be visible', async () => {
  const mockedSa = mockedParties[17];
  renderWithProviders(<DashboardOverview party={mockedSa} products={mockedPartyProducts} />);

  // Avaible products section is not visible for SA
  expect(screen.queryByText('Prodotti disponibili')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with institutionType AS and Product Available section should not be visible', async () => {
  const mockedInsuranceCompany = mockedParties[18];
  renderWithProviders(
    <DashboardOverview party={mockedInsuranceCompany} products={mockedPartyProducts} />
  );

  // Avaible products section is not visible for AS
  expect(screen.queryByText('Prodotti disponibili')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with no geoTaxonomy', async () => {
  const mockedPAWithNoGeoTax = mockedParties[0];
  renderWithProviders(
    <DashboardOverview party={mockedPAWithNoGeoTax} products={mockedPartyProducts} />
  );

  // geo tax modal is visile bc mockedPAWithNoGeoTax has no geoTaxonomies
  const geoTaxLocalBtn = await screen.findByText('Locale');

  fireEvent.click(geoTaxLocalBtn);

});
