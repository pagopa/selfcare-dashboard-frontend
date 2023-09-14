import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardOverview from '../DashboardOverview';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

test('should render component DashboardOverview with empty party', () => {
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
});

test('should render component DashboardOverview with populated props and product prod-pagopa', async () => {
  renderWithProviders(
    <DashboardOverview party={mockedParties[0]} products={mockedPartyProducts} />
  );
});

test('should render component DashboardOverview with populated props and product prod-io', async () => {
  renderWithProviders(
    <DashboardOverview party={mockedParties[1]} products={mockedPartyProducts} />
  );
});
