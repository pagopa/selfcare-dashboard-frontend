import { DashboardApi } from '../api/DashboardApiClient';
import { IdentityTokenResource } from '../api/generated/b4f-dashboard/IdentityTokenResource';
import { Party } from '../model/Party';
import { Product } from '../model/Product';

export const retrieveBackOfficeUrl = (
  selectedParty?: Party,
  product?: Product,
  environment?: string
): Promise<string> =>
  DashboardApi.getBackOfficeUrl(selectedParty?.partyId ?? '', product?.id ?? '', environment);

export const getBillingToken = (
  partyId: string,
  environment?: string
): Promise<IdentityTokenResource> => {
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) => resolve({ token: 'DUMMYTOKEN' }));
  } else {
    return DashboardApi.getBillingToken(partyId, environment);
  }
};
