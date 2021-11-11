import { useEffect } from 'react';
import useLoading from '../hooks/useLoading';
import { Party } from '../model/Party';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchParties } from '../services/partyService';
import { LOADING_TASK_SEARCH_PARTIES } from '../utils/constants';

export default function withParties<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithParties = (props: T) => {
    const dispatch = useAppDispatch();
    const parties = useAppSelector(partiesSelectors.selectPartiesList);
    const setPartiesList = (parties: Array<Party>) =>
      dispatch(partiesActions.setPartiesList(parties));
    const setLoading = useLoading(LOADING_TASK_SEARCH_PARTIES);

    useEffect(() => {
      if (!parties) {
        setLoading(true);
        fetchParties()
          .then(setPartiesList)
          .catch((reason) => {
            /* TODO  errorHandling */ console.error(reason);
          })
          .finally(() => setLoading(false));
      }
    }, []);

    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithParties.displayName = `withParties(${displayName})`;

  return ComponentWithParties;
}
