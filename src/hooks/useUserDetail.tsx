import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { PartyUser } from '../model/PartyUser';
import { fetchPartyUser } from '../services/usersService';
import { LOADING_TASK_FETCH_PARTY_USER } from '../utils/constants';

export const useUserDetail = (institutionId: string, userId: string): (() => Promise<PartyUser | null>) => {
  const setLoading = useLoading(LOADING_TASK_FETCH_PARTY_USER);
  return (): Promise<PartyUser | null> => {
    setLoading(true);
    return fetchPartyUser(institutionId, userId).finally(() => setLoading(false));
  };
};
