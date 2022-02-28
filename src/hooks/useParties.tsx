import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { Party } from '../model/Party';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchParties } from '../services/partyService';
import { LOADING_TASK_SEARCH_PARTIES } from '../utils/constants';

export const useParties = (): { fetchParties: () => Promise<Array<Party>> } => {
  const dispatch = useAppDispatch();
  const parties = useAppSelector(partiesSelectors.selectPartiesList);
  const setPartiesList = (parties: Array<Party>) =>
    dispatch(partiesActions.setPartiesList(parties));
  const setLoading = useLoading(LOADING_TASK_SEARCH_PARTIES);

  const loadParties = (): Promise<Array<Party>> => {
    if (!parties) {
      setLoading(true);
      return fetchParties()
        .then((parties) => {
          setPartiesList(parties);
          return parties;
        })
        .finally(() => setLoading(false));
    } else {
      return new Promise((resolve) => resolve(parties));
    }
  };

  return { fetchParties: loadParties };
};
