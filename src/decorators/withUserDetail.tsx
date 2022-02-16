import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { uniqueId } from 'lodash';
import { PartyUser } from '../model/PartyUser';
import { useUserDetail } from '../hooks/useUserDetail';

type UserUrlParams = {
  institutionId: string;
  userId: string;
};

export default function withUserDetail<T extends { partyUser: PartyUser }>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'partyUser' | 'fetchPartyUser'>> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithUserDetail = (props: T) => {
    const { institutionId, userId } = useParams<UserUrlParams>();
    const fetchUserDetail = useUserDetail();
    const [partyUser, setPartyUser] = useState<PartyUser | null>();
    const addError = useErrorDispatcher();

    const doFetch = () => {
      fetchUserDetail(institutionId, userId)
        .then((user) => setPartyUser(user))
        .catch((reason) => {
          addError({
            id: uniqueId(`${ComponentWithUserDetail.displayName}-`),
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching user detail in component ${ComponentWithUserDetail.displayName}`,
            onRetry: doFetch,
            toNotify: true,
          });
        });
    };

    useEffect(() => {
      if (institutionId && userId) {
        doFetch();
      }
    }, [institutionId, userId]);

    return partyUser ? <WrappedComponent {...(props as T)} partyUser={partyUser} fetchPartyUser={doFetch}/> : <></>;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithUserDetail.displayName = `withUserDetail(${displayName})`;

  return ComponentWithUserDetail as React.ComponentType<Omit<T, 'partyUser' | 'fetchPartyUser'>>;
}
