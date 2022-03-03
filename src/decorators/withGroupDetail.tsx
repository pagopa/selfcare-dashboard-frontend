import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { uniqueId } from 'lodash';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { DASHBOARD_ROUTES } from '../routes';
import { Party } from '../model/Party';
import { ProductsMap } from '../model/Product';
import { useGroupDetail } from '../hooks/useGroupDetail';
import { PartyGroupExt } from '../model/PartyGroup';

export type withGroupDetailProps = {
  partyGroup: PartyGroupExt;
  party: Party;
  productsMap: ProductsMap;
};

type GroupUrlParams = {
  institutionId: string;
  groupId: string;
};

export default function withGroupDetail<T extends withGroupDetailProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'partyGroup' | 'fetchPartyGroup'>> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithGroupDetail = (props: T) => {
    const { institutionId, groupId } = useParams<GroupUrlParams>();

    const fetchUserDetail = useGroupDetail();

    const [partyGroup, setPartyGroup] = useState<PartyGroupExt | null>();

    const addError = useErrorDispatcher();
    const history = useHistory();

    const doFetch = () => {
      fetchUserDetail(institutionId, groupId, props.productsMap)
        .then((group) => {
          if (group === null) {
            // TODO: insert table group path
            const goBackUrl = resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.path, {
              institutionId,
            });

            addError({
              id: 'INVALID_PARTY_GROUP_ID_' + groupId + '__' + institutionId,
              blocking: false,
              techDescription: `Selected an invalid group Id ${groupId} and/or institution id ${institutionId}`,
              toNotify: false,
              error: new Error('INVALID_PARTY_GROUP_ID_INSTITUTION_ID'),
              onClose: () => history.push(goBackUrl),
              displayableDescription: "Impossibile trovare il gruppo selezionato",
            });
          }
          setPartyGroup(group);
        })
        .catch((reason) => {
          addError({
            id: uniqueId(`${ComponentWithGroupDetail.displayName}-`),
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching group detail in component ${ComponentWithGroupDetail.displayName}`,
            onRetry: doFetch,
            toNotify: true,
          });
        });
    };

    useEffect(() => {
      if (props.party.userRole !== 'ADMIN') {
        history.push(resolvePathVariables(DASHBOARD_ROUTES.OVERVIEW.path, { institutionId }));
      } else if (institutionId && groupId) {
        doFetch();
      }
    }, [institutionId, groupId]);

    return partyGroup ? (
      <WrappedComponent {...props} partyGroup={partyGroup} fetchPartyGroup={doFetch} />
    ) : (
      <></>
    );
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithGroupDetail.displayName = `withGroupDetail(${displayName})`;

  return ComponentWithGroupDetail as React.ComponentType<Omit<T, 'partyGroup' | 'fetchPartyGroup'>>;
}
