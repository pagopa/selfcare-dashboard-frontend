import { mockedBrokerResource } from '../../api/__mocks__/DashboardApiClient';
import { DashboardApi } from '../../api/DashboardApiClient';
import { InstitutionTypeEnum } from '../../api/generated/b4f-dashboard/InstitutionResource';
import { institutionBaseResource2BaseParty, institutionResource2Party } from '../../model/Party';
import {
  createDelegation,
  fetchParties,
  fetchPartyDetails,
  getProductBrokers,
} from '../partyService'; // Replace with the actual file path
import { mockedBaseParties, mockedParties } from './../__mocks__/partyService';

// Mock the DashboardApi methods
jest.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getInstitutions: jest.fn(),
    getInstitution: jest.fn(),
    getProductBrokers: jest.fn(),
    createDelegation: jest.fn()
  }
}));

describe('yourModuleFile tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchParties', () => {
    test('returns mockedBaseParties when REACT_APP_API_MOCK_PARTIES is true', async () => {
      process.env.REACT_APP_API_MOCK_PARTIES = 'true';

      const result = await fetchParties();
      expect(result).toEqual(mockedBaseParties);
    });

    test('calls DashboardApi.getInstitutions and maps the result', async () => {
      process.env.REACT_APP_API_MOCK_PARTIES = 'false';
      const mockedInstitutions = [{ id: '1', name: 'Institution 1' }];
      (DashboardApi.getInstitutions as jest.Mock).mockResolvedValue(mockedInstitutions);

      const result = await fetchParties();
      expect(DashboardApi.getInstitutions).toHaveBeenCalled();
      // Adjust the expected result based on the actual mapping logic
      expect(result).toEqual(mockedInstitutions.map(institutionBaseResource2BaseParty));
    });
  });

  describe('fetchPartyDetails', () => {
    test('returns the matching party from mockedParties when REACT_APP_API_MOCK_PARTIES is true', async () => {
      process.env.REACT_APP_API_MOCK_PARTIES = 'true';
      const partyId = '1';

      const result = await fetchPartyDetails(partyId);
      expect(result).toEqual(mockedParties.find((p) => p.partyId === partyId));
    });

    test('calls DashboardApi.getInstitution and maps the result', async () => {
      process.env.REACT_APP_API_MOCK_PARTIES = 'false';
      const partyId = '1';
      const mockedInstitution = { id: '1', name: 'Institution 1' };
      (DashboardApi.getInstitution as jest.Mock).mockResolvedValue(mockedInstitution);

      const result = await fetchPartyDetails(partyId);
      expect(DashboardApi.getInstitution).toHaveBeenCalledWith(partyId);
      // Adjust the expected result based on the actual mapping logic
      expect(result).toEqual(institutionResource2Party(mockedInstitution));
    });
  });

  describe('getProductBrokers', () => {
    test('returns mockedBrokerResource when REACT_APP_API_MOCK_PARTIES is true', async () => {
      process.env.REACT_APP_API_MOCK_PARTIES = 'true';
      const partyId = '1';
      const institutionType = InstitutionTypeEnum.SCP;

      const result = await getProductBrokers(partyId, institutionType);
      expect(result).toEqual(mockedBrokerResource);
    });

    test('calls DashboardApi.getProductBrokers', async () => {
      process.env.REACT_APP_API_MOCK_PARTIES = 'false';
      const partyId = '1';
      const institutionType = InstitutionTypeEnum.PA;
      const mockedBrokers = [{ id: 'broker1', name: 'Broker 1' }];
      (DashboardApi.getProductBrokers as jest.Mock).mockResolvedValue(mockedBrokers);

      const result = await getProductBrokers(partyId, institutionType);
      expect(DashboardApi.getProductBrokers).toHaveBeenCalledWith(partyId, institutionType);
      expect(result).toEqual(mockedBrokers);
    });
  });

  describe('createDelegation', () => {
    test('returns a mock delegation ID when REACT_APP_API_MOCK_PARTIES is true', async () => {
      process.env.REACT_APP_API_MOCK_PARTIES = 'true';
      const party = { partyId: 'party1' } as any;
      const product = { productId: 'product1' } as any;
      const techPartner = { brokerId: 'broker1' } as any;

      const result = await createDelegation(party, product, techPartner);
      expect(result).toEqual({ id: 'mockRelId' });
    });

    test('calls DashboardApi.createDelegation', async () => {
      process.env.REACT_APP_API_MOCK_PARTIES = 'false';
      const party = { partyId: 'party1' } as any;
      const product = { productId: 'product1' } as any;
      const techPartner = { brokerId: 'broker1' } as any;
      const mockDelegationId = { id: 'realRelId' };
      (DashboardApi.createDelegation as jest.Mock).mockResolvedValue(mockDelegationId);

      const result = await createDelegation(party, product, techPartner);
      expect(DashboardApi.createDelegation).toHaveBeenCalledWith(party, product, techPartner);
      expect(result).toEqual(mockDelegationId);
    });
  });
});
