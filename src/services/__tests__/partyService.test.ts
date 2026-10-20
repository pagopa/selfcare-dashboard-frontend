/* eslint-disable functional/no-let, functional/immutable-data */
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { Mock } from 'vitest';
import { mockedBrokerResource } from '../../api/__mocks__/DashboardApiClient';
import { DashboardApi } from '../../api/DashboardApiClient';
import { institutionBaseResource2BaseParty, institutionResource2Party } from '../../model/Party';
import {
  createDelegation,
  fetchParties,
  fetchPartyDetails,
  getAttachmentStatusService,
  getOnboardingInfo,
  getProductBrokers,
  getUserOtpEmailInfoService,
} from '../partyService';
import { mockedBaseParties, mockedParties } from './../__mocks__/partyService';

// Mock the DashboardApi methods
vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getInstitutions: vi.fn(),
    getInstitution: vi.fn(),
    getAllInstituionById: vi.fn(),
    getProductBrokers: vi.fn(),
    createDelegation: vi.fn(),
    getOnboardingInfo: vi.fn(),
    getAttachmentStatus: vi.fn(),
    getUserOtpEmailInfo: vi.fn(),
  },
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => {
  const actual: any = await importOriginal();
  return { ...actual, isPagoPaUser: vi.fn(() => false) };
});

describe('yourModuleFile tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchParties', () => {
    test('returns mockedBaseParties when VITE_API_MOCK_PARTIES is true', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'true';

      const result = await fetchParties();
      expect(result).toEqual(mockedBaseParties);
    });

    test('calls DashboardApi.getInstitutions and maps the result', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      const mockedInstitutions = [{ id: '1', name: 'Institution 1' }];
      (DashboardApi.getInstitutions as Mock).mockResolvedValue(mockedInstitutions);

      const result = await fetchParties();
      expect(DashboardApi.getInstitutions).toHaveBeenCalled();
      expect(result).toEqual(mockedInstitutions.map(institutionBaseResource2BaseParty));
    });
  });

  describe('fetchPartyDetails', () => {
    test('returns the matching party from mockedParties when VITE_API_MOCK_PARTIES is true', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'true';
      const partyId = '1';

      const result = await fetchPartyDetails(partyId);
      expect(result).toEqual(mockedParties.find((p) => p.partyId === partyId));
    });

    test('calls DashboardApi.getInstitution and maps the result', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      const partyId = '1';
      const mockedInstitution = { id: '1', name: 'Institution 1' };
      (DashboardApi.getInstitution as Mock).mockResolvedValue(mockedInstitution);

      const result = await fetchPartyDetails(partyId);
      expect(DashboardApi.getInstitution).toHaveBeenCalledWith(partyId);
      expect(result).toEqual(institutionResource2Party(mockedInstitution));
    });
  });

  describe('getProductBrokers', () => {
    test('returns mockedBrokerResource when VITE_API_MOCK_PARTIES is true', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'true';
      const partyId = '1';
      const institutionType = 'SCP';

      const result = await getProductBrokers(partyId, institutionType);
      expect(result).toEqual(mockedBrokerResource);
    });

    test('calls DashboardApi.getProductBrokers', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      const partyId = '1';
      const institutionType = 'PA';
      const mockedBrokers = [{ id: 'broker1', name: 'Broker 1' }];
      (DashboardApi.getProductBrokers as Mock).mockResolvedValue(mockedBrokers);

      const result = await getProductBrokers(partyId, institutionType);
      expect(DashboardApi.getProductBrokers).toHaveBeenCalledWith(partyId, institutionType);
      expect(result).toEqual(mockedBrokers);
    });
  });

  describe('createDelegation', () => {
    test('returns a mock delegation ID when VITE_API_MOCK_PARTIES is true', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'true';
      const party = { partyId: 'party1' } as any;
      const product = { productId: 'product1' } as any;
      const techPartner = { brokerId: 'broker1' } as any;

      const result = await createDelegation(party, product, techPartner);
      expect(result).toEqual({ id: 'mockRelId' });
    });

    test('calls DashboardApi.createDelegation', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      const party = { partyId: 'party1' } as any;
      const product = { productId: 'product1' } as any;
      const techPartner = { brokerId: 'broker1' } as any;
      const mockDelegationId = { id: 'realRelId' };
      (DashboardApi.createDelegation as Mock).mockResolvedValue(mockDelegationId);

      const result = await createDelegation(party, product, techPartner);
      expect(DashboardApi.createDelegation).toHaveBeenCalledWith(party, product, techPartner);
      expect(result).toEqual(mockDelegationId);
    });
  });

  describe('fetchParties null response', () => {
    test('returns an empty array when the API returns no institutions', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      (DashboardApi.getInstitutions as Mock).mockResolvedValue(undefined);

      await expect(fetchParties()).resolves.toEqual([]);
    });
  });

  describe('fetchPartyDetails edge cases', () => {
    test('returns null in mock mode when the party does not exist', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'true';

      await expect(fetchPartyDetails('not-existing')).resolves.toBeNull();
    });

    test('returns null when the API returns no institution', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      (DashboardApi.getInstitution as Mock).mockResolvedValue(null);

      await expect(fetchPartyDetails('1')).resolves.toBeNull();
    });

    test('uses getAllInstituionById for PagoPA users', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      (isPagoPaUser as Mock).mockReturnValueOnce(true);
      const institution = { id: '9', name: 'Institution 9' };
      (DashboardApi.getAllInstituionById as Mock).mockResolvedValue(institution);

      const result = await fetchPartyDetails('9');

      expect(DashboardApi.getAllInstituionById).toHaveBeenCalledWith('9');
      expect(DashboardApi.getInstitution).not.toHaveBeenCalled();
      expect(result).toEqual(institutionResource2Party(institution as any));
    });
  });

  describe('getOnboardingInfo', () => {
    test('returns mocked onboarding info in mock mode', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'true';

      const result = await getOnboardingInfo('1', 'prod-io');

      expect(result.map((o) => o.productId)).toEqual([
        'prod-io',
        'prod-io-premium',
        'prod-dashboard-psp',
      ]);
      expect(DashboardApi.getOnboardingInfo).not.toHaveBeenCalled();
    });

    test('calls DashboardApi.getOnboardingInfo', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      const info = [{ productId: 'prod-pn', status: 'ACTIVE' }];
      (DashboardApi.getOnboardingInfo as Mock).mockResolvedValue(info);

      await expect(getOnboardingInfo('1', 'prod-pn')).resolves.toEqual(info);
      expect(DashboardApi.getOnboardingInfo).toHaveBeenCalledWith('1', 'prod-pn');
    });
  });

  describe('getAttachmentStatusService', () => {
    test('returns a not available attachment in mock mode', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'true';

      await expect(getAttachmentStatusService('1', 'prod-io', 'file')).resolves.toEqual({
        isAttachmentAvailable: false,
      });
    });

    test('calls DashboardApi.getAttachmentStatus', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      (DashboardApi.getAttachmentStatus as Mock).mockResolvedValue({ isAttachmentAvailable: true });

      await expect(getAttachmentStatusService('1', 'prod-io', 'file')).resolves.toEqual({
        isAttachmentAvailable: true,
      });
      expect(DashboardApi.getAttachmentStatus).toHaveBeenCalledWith('1', 'prod-io', 'file');
    });
  });

  describe('getUserOtpEmailInfoService', () => {
    test('returns mocked otp info in mock mode', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'true';

      const result = await getUserOtpEmailInfoService();

      expect(result).toEqual(
        expect.objectContaining({ otpEmail: 'mock@pec.com', userId: 'mockUserId' })
      );
    });

    test('calls DashboardApi.getUserOtpEmailInfo', async () => {
      import.meta.env.VITE_API_MOCK_PARTIES = 'false';
      const info = { otpEmail: 'real@pec.com', canUserChangeOtpEmail: false };
      (DashboardApi.getUserOtpEmailInfo as Mock).mockResolvedValue(info);

      await expect(getUserOtpEmailInfoService()).resolves.toEqual(info);
    });
  });
});
