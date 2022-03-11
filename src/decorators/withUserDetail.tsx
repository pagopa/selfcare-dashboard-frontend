import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { uniqueId } from 'lodash';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { PartyUser } from '../model/PartyUser';
import { useUserDetail } from '../hooks/useUserDetail';
import { DASHBOARD_ROUTES } from '../routes';
import { Party } from '../model/Party';
import { ProductsMap } from '../model/Product';

export type withUserDetailProps = {
  partyUser: PartyUser;
  party: Party;
  productsMap: ProductsMap;
};

type UserUrlParams = {
  institutionId: string;
  userId: string;
  productId?: string;
};

export default function withUserDetail<T extends withUserDetailProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'partyUser' | 'fetchPartyUser'>> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithUserDetail = (props: T) => {
    const { institutionId, userId, productId } = useParams<UserUrlParams>();
    const fetchUserDetail = useUserDetail();
    const [partyUser, setPartyUser] = useState<PartyUser | null>();
    const addError = useErrorDispatcher();
    const history = useHistory();

    const doFetch = () => {
      fetchUserDetail(institutionId, userId, props.productsMap)
        .then((user) => {
          if (user === null) {
            const goBackUrl = productId
              ? resolvePathVariables(DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.path, {
                  institutionId,
                  productId,
                })
              : resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.path, {
                  institutionId,
                });

            addError({
              id: 'INVALID_PARTY_USER_ID_' + userId + '__' + institutionId,
              blocking: false,
              techDescription: `Selected an invalid user Id ${userId} and/or institution id ${institutionId}`,
              toNotify: false,
              error: new Error('INVALID_PARTY_USER_ID_INSTITUTION_ID'),
              onClose: () => history.push(goBackUrl),
              displayableDescription: "Impossibile trovare l'utente selezionato",
            });
          }
          setPartyUser(user);
        })
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
      if (props.party.userRole !== 'ADMIN') {
        history.push(resolvePathVariables(DASHBOARD_ROUTES.OVERVIEW.path, { institutionId }));
      } else if (institutionId && userId) {
        doFetch();
      } else {
        throw new Error(
          'Using withUserDetail decorator under a path without institutionId or userId'
        );
      }
    }, [institutionId, userId]);

    return partyUser ? (
      <WrappedComponent {...props} partyUser={partyUser} fetchPartyUser={doFetch} />
    ) : (
      <></>
    );
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithUserDetail.displayName = `withUserDetail(${displayName})`;

  return ComponentWithUserDetail as React.ComponentType<Omit<T, 'partyUser' | 'fetchPartyUser'>>;
}
