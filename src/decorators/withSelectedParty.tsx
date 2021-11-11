import { useEffect } from 'react';
import { useParams } from 'react-router';
import useLoading from '../hooks/useLoading';
import { Party } from '../model/Party';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchPartyDetails } from '../services/partyService';
import { LOADING_TASK_SEARCH_PARTY } from '../utils/constants';

type DashboardUrlParams = {
  institutionId: string;
};

export default function withSelectedParty<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedParty = (props: T) => {
    const dispatch = useAppDispatch();
    const { institutionId } = useParams<DashboardUrlParams>();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const parties = useAppSelector(partiesSelectors.selectPartiesList);
    const setParty = (party: Party) => dispatch(partiesActions.setPartySelected(party));
    const setLoading = useLoading(LOADING_TASK_SEARCH_PARTY);

    useEffect(() => {
      if (!selectedParty || selectedParty.institutionId !== institutionId) {
        setLoading(true);
        fetchPartyDetails(institutionId, parties)
          .then((p) => {
            if (p) {
              setParty(p);
            } else {
              throw new Error(`Cannot find institutionId ${institutionId}`);
            }
          })
          .catch((reason) => {
            /* TODO  errorHandling */ console.error(reason);
          })
          .finally(() => setLoading(false));
      }
    }, []);
    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedParty.displayName = `withSelectedParty(${displayName})`;

  return ComponentWithSelectedParty;
}
