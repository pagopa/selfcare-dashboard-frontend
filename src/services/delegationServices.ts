import { DashboardApi } from '../api/DashboardApiClient';
import { DelegationResource, TypeEnum } from '../api/generated/b4f-dashboard/DelegationResource';
import { delegationResource2Delegation } from '../model/Delegations';

export const mockedDelegations: Array<DelegationResource> = [
  {
    id: '',
    institutionFromRootName: '',
    institutionName: '',
    partnerName: '',
    productId: '',
    to: '',
    type: TypeEnum.PT,
  },
];
export const fetchDelegations = (partyId: string): Promise<Array<DelegationResource>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
    return new Promise((resolve) => resolve(mockedDelegations));
  } else {
    return DashboardApi.getDelegations(partyId).then((delegationsResource) =>
      delegationsResource ? delegationsResource.map(delegationResource2Delegation) : []
    );
  }
};
