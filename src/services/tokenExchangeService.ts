import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product } from '../model/Product';

export const retrieveTokenExchange = (
  selectedParty: Party,
  product: Product,
  environment?: string
): Promise<string> =>
  DashboardApi.getTokenExchange(selectedParty.partyId, product.id, environment).then(
    (r) => r.token
  );
