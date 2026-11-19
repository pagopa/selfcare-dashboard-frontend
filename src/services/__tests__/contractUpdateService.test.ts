import { DashboardApi } from '../../api/DashboardApiClient';
import { Party } from '../../model/Party';
import { ContractUpdateDraft } from '../../model/ContractUpdate';
import { initialWizardState } from '../../pages/documents/contractUpdate/ContractUpdateWizardContext';
import {
  buildContractUpdateRequest,
  fetchProductsContractUpdateStatus,
  submitContractUpdate,
} from '../contractUpdateService';

vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getDocumentStatus: vi.fn(),
    onboardingContractUpdate: vi.fn(),
  },
}));

const party: Party = {
  partyId: 'party-1',
  description: 'Comune di Roma',
  registeredOffice: 'Piazza del Campidoglio 1',
  typology: 'Pubblica Amministrazione',
  fiscalCode: '02438750586',
  subunitCode: 'UO-1',
  origin: 'SELC',
  originId: 'party-origin-id',
  institutionType: 'GSP',
  products: [
    { productId: 'prod-io', origin: 'IPA', originId: 'c_h501', institutionType: 'PA' },
    { productId: 'prod-pagopa' },
  ],
};

const draft: ContractUpdateDraft = {
  legalRepresentative: {
    name: ' Mario ',
    surname: 'Rossi ',
    taxCode: 'rssmra80a01h501u',
    email: ' mario.rossi@comune.it',
  },
  admins: [
    {
      key: 'admin-0',
      name: 'Old',
      surname: 'Manager',
      taxCode: 'RSSMRA80A01H501U',
      email: 'old@comune.it',
      originalTaxCode: 'RSSMRA80A01H501U',
    },
    {
      key: 'admin-1',
      name: 'Giulia',
      surname: 'Bianchi',
      taxCode: 'BNCGLI80A41H501X',
      email: 'giulia@comune.it',
    },
  ],
};

test('maps the draft to the request, with the Legal Representative as MANAGER and the visible admins as DELEGATE', () => {
  expect(buildContractUpdateRequest(party, 'prod-io', draft)).toEqual({
    origin: 'IPA',
    originId: 'c_h501',
    institutionType: 'PA',
    taxCode: '02438750586',
    subunitCode: 'UO-1',
    users: [
      {
        name: 'Mario',
        surname: 'Rossi',
        taxCode: 'RSSMRA80A01H501U',
        email: 'mario.rossi@comune.it',
        role: 'MANAGER',
      },
      {
        name: 'Giulia',
        surname: 'Bianchi',
        taxCode: 'BNCGLI80A41H501X',
        email: 'giulia@comune.it',
        role: 'DELEGATE',
      },
    ],
  });
});

test('falls back to the party origin data when the onboarded product has none', () => {
  expect(buildContractUpdateRequest(party, 'prod-pagopa', initialWizardState.draft)).toMatchObject({
    origin: 'SELC',
    originId: 'party-origin-id',
    institutionType: 'GSP',
  });
});

test('sends the request for the selected party and product', async () => {
  import.meta.env.VITE_API_MOCK_PARTIES = 'false';
  vi.mocked(DashboardApi.onboardingContractUpdate).mockResolvedValue(undefined);

  await submitContractUpdate(party, 'prod-io', draft);

  expect(DashboardApi.onboardingContractUpdate).toHaveBeenCalledWith(
    'party-1',
    'prod-io',
    buildContractUpdateRequest(party, 'prod-io', draft)
  );
});

test('fetches contract update statuses for the requested products', async () => {
  import.meta.env.VITE_API_MOCK_PARTIES = 'false';
  vi.mocked(DashboardApi.getDocumentStatus).mockResolvedValue({
    products: [
      {
        productId: 'prod-io',
        contractUpdateRequired: true,
        contractUpdateInProgress: false,
      },
    ],
  });

  await expect(fetchProductsContractUpdateStatus('party-1', ['prod-io'])).resolves.toEqual([
    {
      productId: 'prod-io',
      contractUpdateRequired: true,
      contractUpdateInProgress: false,
    },
  ]);
  expect(DashboardApi.getDocumentStatus).toHaveBeenCalledWith('party-1', ['prod-io']);
});

test('does not call the status endpoint when there are no products', async () => {
  vi.mocked(DashboardApi.getDocumentStatus).mockClear();
  await expect(fetchProductsContractUpdateStatus('party-1', [])).resolves.toEqual([]);
  expect(DashboardApi.getDocumentStatus).not.toHaveBeenCalled();
});

test('returns the local document-status mock for requested products', async () => {
  const originalMockParties = import.meta.env.VITE_API_MOCK_PARTIES;
  import.meta.env.VITE_API_MOCK_PARTIES = 'true';
  try {
    await expect(
      fetchProductsContractUpdateStatus('party-1', ['prod-io', 'unknown-product'])
    ).resolves.toEqual([
      {
        productId: 'prod-io',
        contractUpdateRequired: true,
        contractUpdateInProgress: false,
      },
    ]);
  } finally {
    import.meta.env.VITE_API_MOCK_PARTIES = originalMockParties;
  }
  expect(DashboardApi.getDocumentStatus).not.toHaveBeenCalled();
});
