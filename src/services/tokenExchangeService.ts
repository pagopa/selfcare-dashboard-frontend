import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product } from '../model/Product';

export const retrieveBackOfficeUrl = (
  selectedParty?: Party,
  product?: Product,
  environment?: string,
  lang?: string
): Promise<string> => {
  if (isPagoPaUser) {
    return DashboardApi.tokenExchangeAdmin(
      selectedParty?.partyId ?? '',
      product?.id ?? '',
      environment,
      lang
    );
  } else {
    return DashboardApi.getBackOfficeUrl(
      selectedParty?.partyId ?? '',
      product?.id ?? '',
      environment,
      lang
    );
  }
};

export const getBillingToken = (
  partyId: string,
  environment?: string,
  lang?: string
): Promise<string> => {
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) => resolve('DUMMYTOKEN'));
  } else {
    return DashboardApi.getBillingToken(partyId, environment, lang);
  }
};
