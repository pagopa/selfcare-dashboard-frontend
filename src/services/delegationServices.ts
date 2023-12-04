import { DashboardApi } from '../api/DashboardApiClient';
import { DelegationResource, TypeEnum } from '../api/generated/b4f-dashboard/DelegationResource';
import { mockedBrokerResource } from '../api/__mocks__/DashboardApiClient';
import { mockedParties } from './__mocks__/partyService';
import { mockedPartyProducts } from './__mocks__/productService';

export const mockedDelegations: Array<DelegationResource> = [
  {
    id: '0000',
    brokerId: mockedBrokerResource[0].code,
    brokerName: mockedBrokerResource[0].description,
    institutionId: mockedParties[2].partyId,
    institutionName: mockedParties[2].description,
    productId: mockedPartyProducts[0].id,
    type: TypeEnum.PT,
  },
  {
    id: '1111',
    brokerId: mockedBrokerResource[1].code,
    brokerName: mockedBrokerResource[1].description,
    institutionId: mockedParties[2].partyId,
    institutionName: mockedParties[2].description,
    productId: mockedPartyProducts[0].id,
    type: TypeEnum.PT,
  },
  {
    id: '2222',
    brokerId: mockedBrokerResource[2].code,
    brokerName: mockedBrokerResource[2].description,
    institutionId: mockedParties[2].partyId,
    institutionName: mockedParties[2].description,
    productId: mockedPartyProducts[2].id,
    type: TypeEnum.PT,
  },
  {
    id: '3333',
    brokerId: mockedBrokerResource[3].code,
    brokerName: mockedBrokerResource[3].description,
    institutionId: mockedParties[3].partyId,
    institutionName: mockedParties[3].description,
    productId: mockedPartyProducts[2].id,
    type: TypeEnum.PT,
  },
  {
    id: '4444',
    brokerId: mockedBrokerResource[4].code,
    brokerName: mockedBrokerResource[4].description,
    institutionId: mockedParties[4].partyId,
    institutionName: mockedParties[4].description,
    productId: mockedPartyProducts[2].id,
    type: TypeEnum.PT,
  },
];

export const fetchDelegations = (partyId: string): Promise<Array<DelegationResource>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
    return new Promise((resolve) =>
      resolve(mockedDelegations.filter((d) => d.institutionId === partyId))
    );
  } else {
    return DashboardApi.getDelegations(partyId).then((delegationsResource) => delegationsResource);
  }
};
