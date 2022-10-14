import { Party } from '../../model/Party';
import { Product } from '../../model/Product';

export const retrieveBackOfficeUrl = (
  _selectedParty: Party,
  _product: Product,
  _environment: string
): Promise<string> => new Promise((resolve) => resolve('https://hostname/path?id=DUMMYTOKEN'));
