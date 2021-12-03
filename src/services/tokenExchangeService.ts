import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product } from '../model/Product';

export const retrieveTokenExchange = (
  hostname: string,
  selectedParty: Party,
  product: Product
): Promise<string> =>
  DashboardApi.getTokenExchange(hostname, selectedParty.institutionId, product.id);
