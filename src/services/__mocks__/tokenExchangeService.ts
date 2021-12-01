import { Party } from '../../model/Party';

export const retrieveTokenExchange = (_hostname: string, _selectedParty: Party): Promise<string> =>
  new Promise((resolve) => resolve('DUMMYTOKEN'));
