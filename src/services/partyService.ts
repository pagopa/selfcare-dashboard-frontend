import { mockedBrokerResource } from '../api/__mocks__/DashboardApiClient';
import { DashboardApi } from '../api/DashboardApiClient';
import { BrokerResource } from '../api/generated/b4f-dashboard/BrokerResource';
import { DelegationIdResource } from '../api/generated/b4f-dashboard/DelegationIdResource';
import { OnboardingInfo } from '../api/generated/b4f-dashboard/OnboardingInfo';
import {
  BaseParty,
  institutionBaseResource2BaseParty,
  institutionResource2Party,
  Party,
} from '../model/Party';
import { Product } from '../model/Product';
import { mockedBaseParties, mockedParties } from './__mocks__/partyService';

export const fetchParties = (): Promise<Array<BaseParty>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve(mockedBaseParties);
  } else {
    return DashboardApi.getInstitutions().then((institutionResources) =>
      institutionResources ? institutionResources.map(institutionBaseResource2BaseParty) : []
    );
  }
};

export const fetchPartyDetails = (partyId: string): Promise<Party | null> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve(mockedParties.find((p) => p.partyId === partyId) ?? null);
  } else {
    return DashboardApi.getInstitution(partyId).then((institutionResource) =>
      institutionResource ? institutionResource2Party(institutionResource) : null
    );
  }
};

export const getProductBrokers = (
  partyId: string,
  institutionType: string
): Promise<Array<BrokerResource>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve(mockedBrokerResource);
  } else {
    return DashboardApi.getProductBrokers(partyId, institutionType);
  }
};

export const createDelegation = (
  party: Party,
  product: Product,
  techPartner: BrokerResource
): Promise<DelegationIdResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve({ id: 'mockRelId' });
  } else {
    return DashboardApi.createDelegation(party, product, techPartner);
  }
};

export const getOnboardingInfo = (
  institutionId: string,
  products: string
): Promise<Array<OnboardingInfo>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve([
      { productId: 'prod-io', status: 'ACTIVE', contractAvailable: true },
      { productId: 'prod-io-premium', status: 'ACTIVE', contractAvailable: false },
      { productId: 'prod-dashboard-psp', status: 'ACTIVE', contractAvailable: false },
    ]);
  } else {
    return DashboardApi.getOnboardingInfo(institutionId, products);
  }
};
/* 
  TODO used fetch in place of codegen to handle issue with base64 file
export const getContract = (institutionId: string, productId: string): Promise<ContractData> => {

  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve({ contract: '' });
  } else {
    return DashboardApi.getContract(institutionId, productId);
  }
};
 */
