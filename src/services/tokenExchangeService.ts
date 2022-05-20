import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product } from '../model/Product';

export const retrieveTokenExchange = (selectedParty: Party, product: Product): Promise<string> =>
  DashboardApi.getTokenExchange(selectedParty.partyId, product.id).then((r) => r.token);
