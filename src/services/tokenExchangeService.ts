import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product } from '../model/Product';
import { ENV } from '../utils/env';

export const retrieveBackOfficeUrl = (
  selectedParty?: Party,
  product?: Product,
  environment?: string
): Promise<string> => {
  if (ENV.USER.ENABLE_USER_V2) {
    return DashboardApi.getBackOfficeUrlV2(
      selectedParty?.partyId ?? '',
      product?.id ?? '',
      environment
    );
  }
  return DashboardApi.getBackOfficeUrl(selectedParty?.partyId ?? '', product?.id ?? '');
};

export const getBillingToken = (partyId: string, environment?: string): Promise<string> => {
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) => resolve('DUMMYTOKEN'));
  } else {
    if (ENV.USER.ENABLE_USER_V2) {
      return DashboardApi.getBillingTokenV2(partyId, environment);
    }
    return DashboardApi.getBillingToken(partyId, environment);
  }
};
