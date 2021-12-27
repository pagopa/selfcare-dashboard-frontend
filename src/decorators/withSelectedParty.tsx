import { uniqueId } from 'lodash';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelectedParty } from '../hooks/useSelectedParty';
import { useAppDispatch } from '../redux/hooks';
import { AppError, appStateActions } from '../redux/slices/appStateSlice';
import ROUTES from '../routes';

type DashboardUrlParams = {
  institutionId: string;
};

export default function withSelectedParty<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedParty = (props: T) => {
    const dispatch = useAppDispatch();
    const { fetchSelectedParty } = useSelectedParty();
    const { institutionId } = useParams<DashboardUrlParams>();
    const history = useHistory();

    const addError = (error: AppError) => dispatch(appStateActions.addError(error));

    const doFetch = (): void => {
      fetchSelectedParty(institutionId).catch((reason) => {
        const invalidState =
          reason instanceof Error && reason.message.startsWith('INVALID_PARTY_STATE_')
            ? reason.message.replace('INVALID_PARTY_STATE_', '')
            : undefined;
        addError({
          id: uniqueId(`${ComponentWithSelectedParty.displayName}-`),
          blocking: false,
          error: reason,
          displayableDescription: invalidState ? "L'ente selezionato non è gestibile" : undefined,
          techDescription: invalidState
            ? `Requested a party (${institutionId}) with a not handled state ${invalidState}`
            : `An error occurred while retrieving selected party having IPACode ${institutionId} in component ${ComponentWithSelectedParty.displayName}`,
          onRetry: !invalidState ? doFetch : undefined,
          onClose: () => history.push(ROUTES.PARTY_SELECTION.path),
          toNotify: !invalidState,
        });
      });
    };

    useEffect(() => {
      doFetch();
    }, [institutionId]);
    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedParty.displayName = `withSelectedParty(${displayName})`;

  return ComponentWithSelectedParty;
}
