import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { PartyGroupExt } from '../model/PartyGroup';
import { ProductsMap } from '../model/Product';
import { useAppSelector } from '../redux/hooks';
import { fetchPartyGroup } from '../services/groupsService';
import { LOADING_TASK_FETCH_PARTY_GROUP } from '../utils/constants';

export const useGroupDetail = (): ((
  institutionId: string,
  groupId: string,
  productsMap: ProductsMap
) => Promise<PartyGroupExt | null>) => {
  const setLoading = useLoading(LOADING_TASK_FETCH_PARTY_GROUP);
  const currentUser = useAppSelector(userSelectors.selectLoggedUser) as User;

  return (
    institutionId: string,
    groupId: string,
    productsMap: ProductsMap
  ): Promise<PartyGroupExt | null> => {
    setLoading(true);
    return fetchPartyGroup(institutionId, groupId, currentUser, productsMap).finally(() =>
      setLoading(false)
    );
  };
};
