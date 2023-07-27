import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product } from '../model/Product';

export const retrieveBackOfficeUrl = (
  selectedParty?: Party,
  product?: Product,
  environment?: string
): Promise<string> =>
  DashboardApi.getBackOfficeUrl(selectedParty?.partyId ?? '', product?.id ?? '', environment);
