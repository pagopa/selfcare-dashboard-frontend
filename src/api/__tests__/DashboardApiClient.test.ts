import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import type { Mock } from 'vitest';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { store } from '../../redux/store';
import { DashboardApi } from '../DashboardApiClient';
import { BrokerResource } from '../generated/b4f-dashboard/BrokerResource';

const { mockedClient, createClientSpy } = vi.hoisted(() => {
  const methods = [
    'v2RetrieveUserInstitutions',
    'v2GetInstitution',
    'v2GetAllInstitution',
    'getProductsTreeUsingGET',
    'getDelegationsUsingFromUsingGET',
    'saveInstitutionLogoUsingPUT',
    'v2RetrieveProductBackofficeUsingGET',
    'billingTokenUsingGET',
    'v2ExchangeBackofficeAdmin',
    'getDelegationsUsingToUsingGET_1',
    'getProductRolesUsingGET',
    'updateInstitutionGeographicTaxonomyUsingPUT',
    'getProductBrokersUsingGET',
    'createDelegationUsingPOST',
    'v2GetOnboardingsInfo',
    'v2CheckAttachment',
    'getUserOtpEmailInfoUsingGET',
    'getMyPermissions',
    'v2GetUsersUsingGET',
  ];
  const client: Record<string, Mock> = Object.fromEntries(methods.map((m) => [m, vi.fn()]));
  return { mockedClient: client, createClientSpy: vi.fn(() => client) };
});

vi.mock('../generated/b4f-dashboard/client', () => ({
  createClient: createClientSpy,
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    storageTokenOps: { ...actual.storageTokenOps, read: vi.fn(() => 'MOCKED_TOKEN') },
  };
});

const right = (status: number, value?: unknown) => ({ _tag: 'Right', right: { status, value } });
const left = (errors: unknown) => ({ _tag: 'Left', left: errors });

type Case = {
  name: keyof typeof DashboardApi;
  clientMethod: string;
  args: Array<any>;
  expectedParams: Record<string, unknown>;
  successStatus?: number;
};

const party = { partyId: 'party-1', description: 'Party 1' } as Party;
const product = { id: 'prod-io' } as Product;
const logo = new File(['logo'], 'logo.png');

const cases: Array<Case> = [
  {
    name: 'getInstitutions',
    clientMethod: 'v2RetrieveUserInstitutions',
    args: [],
    expectedParams: {},
  },
  {
    name: 'getInstitution',
    clientMethod: 'v2GetInstitution',
    args: ['inst-1'],
    expectedParams: { institutionId: 'inst-1' },
  },
  {
    name: 'getAllInstituionById',
    clientMethod: 'v2GetAllInstitution',
    args: ['inst-1'],
    expectedParams: { institutionId: 'inst-1' },
  },
  { name: 'getProducts', clientMethod: 'getProductsTreeUsingGET', args: [], expectedParams: {} },
  {
    name: 'getDelegations',
    clientMethod: 'getDelegationsUsingFromUsingGET',
    args: ['inst-1'],
    expectedParams: { institutionId: 'inst-1' },
  },
  {
    name: 'uploadLogo',
    clientMethod: 'saveInstitutionLogoUsingPUT',
    args: ['inst-1', logo],
    expectedParams: { institutionId: 'inst-1', logo },
  },
  {
    name: 'getBackOfficeUrl',
    clientMethod: 'v2RetrieveProductBackofficeUsingGET',
    args: ['inst-1', 'prod-io', 'test', 'it'],
    expectedParams: {
      institutionId: 'inst-1',
      productId: 'prod-io',
      environment: 'test',
      lang: 'it',
    },
  },
  {
    name: 'getBillingToken',
    clientMethod: 'billingTokenUsingGET',
    args: ['inst-1', 'test', 'en'],
    expectedParams: { institutionId: 'inst-1', environment: 'test', lang: 'en' },
  },
  {
    name: 'tokenExchangeAdmin',
    clientMethod: 'v2ExchangeBackofficeAdmin',
    args: ['inst-1', 'prod-io', undefined, 'it'],
    expectedParams: {
      institutionId: 'inst-1',
      productId: 'prod-io',
      environment: undefined,
      lang: 'it',
    },
  },
  {
    name: 'getDelegatingInstitutions',
    clientMethod: 'getDelegationsUsingToUsingGET_1',
    args: ['inst-1'],
    expectedParams: { institutionId: 'inst-1' },
  },
  {
    name: 'getProductRoles',
    clientMethod: 'getProductRolesUsingGET',
    args: ['prod-io', 'PA'],
    expectedParams: { productId: 'prod-io', institutionType: 'PA' },
  },
  {
    name: 'updateInstitutionGeographicTaxonomy',
    clientMethod: 'updateInstitutionGeographicTaxonomyUsingPUT',
    args: ['inst-1', [{ code: '058091', desc: 'Roma' }]],
    expectedParams: {
      institutionId: 'inst-1',
      body: { geographicTaxonomyDtoList: [{ code: '058091', desc: 'Roma' }] },
    },
  },
  {
    name: 'getProductBrokers',
    clientMethod: 'getProductBrokersUsingGET',
    args: ['prod-pagopa', 'PSP'],
    expectedParams: { productId: 'prod-pagopa', institutionType: 'PSP' },
  },
  {
    name: 'createDelegation',
    clientMethod: 'createDelegationUsingPOST',
    args: [party, product, { code: 'tp-code', description: 'Tech Partner' } as BrokerResource],
    expectedParams: {
      body: {
        from: 'party-1',
        institutionFromName: 'Party 1',
        institutionToName: 'Tech Partner',
        to: 'tp-code',
        productId: 'prod-io',
        type: 'PT',
      },
    },
    successStatus: 201,
  },
  {
    name: 'getOnboardingInfo',
    clientMethod: 'v2GetOnboardingsInfo',
    args: ['inst-1', 'prod-io,prod-pn'],
    expectedParams: { institutionId: 'inst-1', products: 'prod-io,prod-pn' },
  },
  {
    name: 'getAttachmentStatus',
    clientMethod: 'v2CheckAttachment',
    args: ['inst-1', 'prod-io', 'attachment.pdf'],
    expectedParams: { institutionId: 'inst-1', productId: 'prod-io', name: 'attachment.pdf' },
  },
  {
    name: 'getUserOtpEmailInfo',
    clientMethod: 'getUserOtpEmailInfoUsingGET',
    args: [],
    expectedParams: {},
  },
  { name: 'myPermissionsAdmin', clientMethod: 'getMyPermissions', args: [], expectedParams: {} },
  {
    name: 'getProductUsers',
    clientMethod: 'v2GetUsersUsingGET',
    args: ['inst-1', 'prod-io', ['MANAGER', 'DELEGATE']],
    expectedParams: { institutionId: 'inst-1', productId: 'prod-io', roles: 'MANAGER,DELEGATE' },
  },
];

describe('DashboardApiClient', () => {
  beforeEach(() => {
    Object.values(mockedClient).forEach((m) => m.mockReset());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('createClient is configured with a withDefaults that adds the bearer token', () => {
    expect(createClientSpy).toHaveBeenCalledTimes(1);
    const config = (createClientSpy.mock.calls[0] as Array<any>)[0];
    expect(config.basePath).toBe('');
    expect(typeof config.fetchApi).toBe('function');

    const wrappedOperation = vi.fn((params) => params);
    const result = config.withDefaults(wrappedOperation)({ institutionId: 'inst-1' });

    expect(storageTokenOps.read).toHaveBeenCalled();
    expect(wrappedOperation).toHaveBeenCalledWith({
      institutionId: 'inst-1',
      bearerAuth: 'Bearer MOCKED_TOKEN',
    });
    expect(result.bearerAuth).toBe('Bearer MOCKED_TOKEN');
  });

  test.each(cases)(
    '$name invokes $clientMethod and returns the extracted value',
    async ({ name, clientMethod, args, expectedParams, successStatus }) => {
      const value = { payload: name };
      mockedClient[clientMethod].mockResolvedValue(right(successStatus ?? 200, value));

      const result = await (DashboardApi[name] as any)(...args);

      expect(mockedClient[clientMethod]).toHaveBeenCalledTimes(1);
      expect(mockedClient[clientMethod]).toHaveBeenCalledWith(expectedParams);
      expect(result).toEqual(value);
    }
  );

  test('createDelegation defaults missing techPartner fields to empty strings', async () => {
    mockedClient.createDelegationUsingPOST.mockResolvedValue(right(201, { id: 'rel-1' }));

    await DashboardApi.createDelegation(party, product, {} as BrokerResource);

    expect(mockedClient.createDelegationUsingPOST).toHaveBeenCalledWith({
      body: expect.objectContaining({ institutionToName: '', to: '' }),
    });
  });

  test('throws an error when an unexpected status is returned', async () => {
    mockedClient.v2GetInstitution.mockResolvedValue(right(500, { detail: 'boom' }));

    await expect(DashboardApi.getInstitution('inst-1')).rejects.toThrow(
      'Unexpected HTTP status! Expected 200 obtained 500'
    );
  });

  test('throws "Operation not allowed" on 403', async () => {
    mockedClient.getProductsTreeUsingGET.mockResolvedValue(right(403));

    await expect(DashboardApi.getProducts()).rejects.toThrow('Operation not allowed!');
  });

  test('returns null on 404', async () => {
    mockedClient.v2GetAllInstitution.mockResolvedValue(right(404));

    await expect(DashboardApi.getAllInstituionById('inst-1')).resolves.toBeNull();
  });

  test('rejects when the client returns a validation error (Left)', async () => {
    mockedClient.getMyPermissions.mockResolvedValue(left([{ message: 'invalid' }]));

    await expect(DashboardApi.myPermissionsAdmin()).rejects.toBeDefined();
  });

  test('on 401 dispatches the session expired error and never resolves', async () => {
    vi.useFakeTimers();
    try {
      mockedClient.v2RetrieveUserInstitutions.mockResolvedValue(right(401));
      const settled = vi.fn();

      void DashboardApi.getInstitutions().then(settled, settled);
      await vi.advanceTimersByTimeAsync(0);

      const errors = store.getState().appState.errors;
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^tokenNotValid/),
          techDescription: 'token expired or not valid',
          toNotify: false,
          blocking: false,
        })
      );
      expect(settled).not.toHaveBeenCalled();
    } finally {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });
});
