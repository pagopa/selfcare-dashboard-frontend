import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';

export const retrieveTokenExchange = (hostname: string, selectedParty: Party): Promise<string> =>
  DashboardApi.getTokenExchange(hostname, selectedParty.institutionId);
