import { uniqueId } from 'lodash';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useSelectedParty } from '../hooks/useSelectedParty';
import ROUTES from '../routes';

type DashboardUrlParams = {
  partyId: string;
};

export default function withSelectedParty<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedParty = (props: T) => {
    const { fetchSelectedParty } = useSelectedParty();
    const { partyId } = useParams<DashboardUrlParams>();
    const history = useHistory();

    const addError = useErrorDispatcher();

    const doFetch = (): void => {
      fetchSelectedParty(partyId).catch((reason) => {
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
            ? `Requested a party (${partyId}) with a not handled state ${invalidState}`
            : `An error occurred while retrieving selected party having IPACode ${partyId} in component ${ComponentWithSelectedParty.displayName}`,
          onRetry: !invalidState ? doFetch : undefined,
          onClose: () => history.push(ROUTES.PARTY_SELECTION.path),
          toNotify: !invalidState,
        });
      });
    };

    useEffect(() => {
      doFetch();
    }, [partyId]);
    return <WrappedComponent {...(props as any)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedParty.displayName = `withSelectedParty(${displayName})`;

  return ComponentWithSelectedParty;
}
