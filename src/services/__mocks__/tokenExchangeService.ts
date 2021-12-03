import { Party } from '../../model/Party';
import { Product } from '../../model/Product';

export const retrieveTokenExchange = (
  _hostname: string,
  _selectedParty: Party,
  _product: Product
): Promise<string> => new Promise((resolve) => resolve('DUMMYTOKEN'));
