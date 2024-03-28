import { DashboardApi } from '../api/DashboardApiClient';
import { BrokerResource } from '../api/generated/b4f-dashboard/BrokerResource';
import { DelegationIdResource } from '../api/generated/b4f-dashboard/DelegationIdResource';
import { InstitutionTypeEnum } from '../api/generated/b4f-dashboard/InstitutionResource';
import { mockedBrokerResource } from '../api/__mocks__/DashboardApiClient';
import {
  BaseParty,
  institutionBaseResource2BaseParty,
  institutionResource2Party,
  Party,
} from '../model/Party';
import { Product } from '../model/Product';
import { ENV } from '../utils/env';
import { mockedBaseParties, mockedParties } from './__mocks__/partyService';

export const fetchParties = (): Promise<Array<BaseParty>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) => resolve(mockedBaseParties));
  } else {
    if (ENV.USER.ENABLE_USER_V2) {
      return DashboardApi.getInstitutionsV2().then((institutionResources) =>
        institutionResources ? institutionResources.map(institutionBaseResource2BaseParty) : []
      );
    }
    return DashboardApi.getInstitutions().then((institutionResources) =>
      institutionResources ? institutionResources.map(institutionBaseResource2BaseParty) : []
    );
  }
};

export const fetchPartyDetails = (partyId: string): Promise<Party | null> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) => {
      resolve(mockedParties.find((p) => p.partyId === partyId) ?? null);
    });
  } else {
    if (ENV.USER.ENABLE_USER_V2) {
      return DashboardApi.getInstitutionV2(partyId).then((institutionResource) =>
        institutionResource ? institutionResource2Party(institutionResource) : null
      );
    }
    return DashboardApi.getInstitution(partyId).then((institutionResource) =>
      institutionResource ? institutionResource2Party(institutionResource) : null
    );
  }
};

export const getProductBrokers = (
  partyId: string,
  institutionType: InstitutionTypeEnum
): Promise<Array<BrokerResource>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) => resolve(mockedBrokerResource));
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
    return new Promise((resolve) => resolve({ id: 'mockRelId' }));
  } else {
    return DashboardApi.createDelegation(party, product, techPartner);
  }
};
