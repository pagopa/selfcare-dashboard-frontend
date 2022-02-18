import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { PartyUser } from '../model/PartyUser';
import { useAppSelector } from '../redux/hooks';
import { fetchPartyUser } from '../services/usersService';
import { LOADING_TASK_FETCH_PARTY_USER } from '../utils/constants';

export const useUserDetail = (): ((
  institutionId: string,
  userId: string
) => Promise<PartyUser | null>) => {
  const setLoading = useLoading(LOADING_TASK_FETCH_PARTY_USER);
  const currentUser = useAppSelector(userSelectors.selectLoggedUser) as User;

  return (institutionId: string, userId: string): Promise<PartyUser | null> => {
    setLoading(true);
    return fetchPartyUser(institutionId, userId, currentUser).finally(() => setLoading(false));
  };
};
