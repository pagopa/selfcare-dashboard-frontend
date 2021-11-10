import { useEffect } from 'react';
import { useParams } from 'react-router';
import { PartyProcessApi } from '../api/PartyProcessApiClient';
import useLoading from '../hooks/useLoading';
import { institutionInfo2Party, Party } from '../model/Party';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { LOADING_TASK_SEARCH_PARTY } from '../utils/constants';

type DashboardUrlParams = {
  institutionId: string;
};

const fetchParty = (
  institutionId: string,
  setParty: (p: Party) => void,
  setLoading: (l: boolean) => void
) => {
  setLoading(true);
  PartyProcessApi.getOnBoardingInfo({ institutionId })
    .then((onBoardingInfo) => {
      const party =
        onBoardingInfo.institutions && onBoardingInfo.institutions.length > 0
          ? institutionInfo2Party(onBoardingInfo.institutions[0])
          : null;

      if (!party) {
        throw new Error(`Cannot find institutionId ${institutionId}`);
      }
      setParty(party);
    })
    .catch((reason) => {
      /* TODO  errorHandling */ console.error(reason);
    })
    .finally(() => setLoading(false));
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
        if (parties) {
          const selected = parties.filter((p) => p.institutionId === institutionId);
          if (selected && selected.length > 0) {
            setParty(selected[0]);
          } else {
            fetchParty(institutionId, setParty, setLoading);
          }
        } else {
          fetchParty(institutionId, setParty, setLoading);
        }
      }
    }, []);
    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedParty.displayName = `withSelectedParty(${displayName})`;

  return ComponentWithSelectedParty;
}
