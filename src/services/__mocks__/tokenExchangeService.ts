import { IdentityTokenResource } from '../../api/generated/b4f-dashboard/IdentityTokenResource';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';

export const retrieveBackOfficeUrl = (
  _selectedParty: Party,
  _product: Product,
  _environment: string
): Promise<string> => new Promise((resolve) => resolve('https://hostname/path?id=DUMMYTOKEN'));

export const getBillingToken = (
  _partyId: string,
  _environment?: string
): Promise<IdentityTokenResource> => new Promise((resolve) => resolve({ token: 'DUMMYTOKEN' }));
