import { DashboardApi } from '../api/DashboardApiClient';
import { DelegationResource, TypeEnum } from '../api/generated/b4f-dashboard/DelegationResource';
import { mockedBrokerResource } from '../api/__mocks__/DashboardApiClient';
import { delegationResource2Delegation } from '../model/Delegations';
import { mockedParties } from './__mocks__/partyService';
import { mockedPartyProducts } from './__mocks__/productService';

export const mockedDelegations: Array<DelegationResource> = [
  {
    id: '0000',
    institutionFromRootName: mockedParties[0].partyId,
    institutionName: mockedParties[0].description,
    partnerName: mockedBrokerResource[0].description,
    productId: mockedPartyProducts[0].id,
    to: mockedBrokerResource[0].code,
    type: TypeEnum.PT,
  },
  {
    id: '1111',
    institutionFromRootName: mockedParties[1].partyId,
    institutionName: mockedParties[1].description,
    partnerName: mockedBrokerResource[1].description,
    productId: mockedPartyProducts[0].id,
    to: mockedBrokerResource[1].code,
    type: TypeEnum.PT,
  },
  {
    id: '2222',
    institutionFromRootName: mockedParties[2].partyId,
    institutionName: mockedParties[2].description,
    partnerName: mockedBrokerResource[2].description,
    productId: mockedPartyProducts[2].id,
    to: mockedBrokerResource[2].code,
    type: TypeEnum.PT,
  },
  {
    id: '3333',
    institutionFromRootName: mockedParties[3].partyId,
    institutionName: mockedParties[3].description,
    partnerName: mockedBrokerResource[3].description,
    productId: mockedPartyProducts[2].id,
    to: mockedBrokerResource[3].code,
    type: TypeEnum.PT,
  },
  {
    id: '4444',
    institutionFromRootName: mockedParties[4].partyId,
    institutionName: mockedParties[4].description,
    partnerName: mockedBrokerResource[4].description,
    productId: mockedPartyProducts[2].id,
    to: mockedBrokerResource[4].code,
    type: TypeEnum.PT,
  },
];

export const fetchDelegations = (partyId: string): Promise<Array<DelegationResource>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
    return new Promise((resolve) =>
      resolve(mockedDelegations.filter((d) => d.institutionFromRootName === partyId))
    );
  } else {
    return DashboardApi.getDelegations(partyId).then((delegationsResource) =>
      delegationsResource ? delegationsResource.map(delegationResource2Delegation) : []
    );
  }
};
