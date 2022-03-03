import { Grid, Typography } from '@mui/material';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withGroupDetail, { withGroupDetailProps } from '../../decorators/withGroupDetail';
import { DASHBOARD_ROUTES } from '../../routes';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../utils/constants';
import { PartyGroupStatus } from '../../model/PartyGroup';
import GroupActions from './components/GroupActions';
import GroupDetail from './components/GroupDetail';
import { deletePartyGroup } from './../../services/__mocks__/groupsService';
import { updatePartyGroupStatus } from './../../services/groupsService';

type Props = withGroupDetailProps & {
  fetchPartyGroup: () => void;
};

function GroupDetailPage({ partyGroup, party, productsMap, fetchPartyGroup }: Props) {
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  const addError = useErrorDispatcher();
  const product = productsMap[partyGroup.productId];
  const addNotify = useUserNotify();

  useEffect(() => {
    if (partyGroup) {
      trackEvent('OPEN_USER_DETAIL', { group_id: partyGroup.id });
    }
  }, [partyGroup]);

  const goBack = () =>
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.path, {
        institutionId: party.institutionId,
      })
    );
  const goEdit = () =>
    // TODO: redirect to Group Edit Page
    history.push(
      resolvePathVariables('TODO: redirect to Group Edit Page', {
        institutionId: party.institutionId,
        groupId: partyGroup.id,
      })
    );
  const goToDuplicate = () =>
    // TODO: redirect to Group Duplicate Page
    history.push(
      resolvePathVariables('TODO: redirect to Group Duplicate Page', {
        institutionId: party.institutionId,
        groupId: partyGroup.id,
      })
    );
  const onDelete = () => {
    setLoading(true);
    deletePartyGroup(party, product, partyGroup)
      .then((_) => {
        goBack();
      })
      .catch((reason) =>
        addError({
          id: `DELETE_PARTY_GROUP_ERROR-${partyGroup.id}`,
          blocking: false,
          error: reason,
          techDescription: `Something gone wrong while deleting group ${partyGroup.name}`,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  };

  const confirmChangeStatus = () => {
    const nextGroupStatus: PartyGroupStatus | undefined =
      partyGroup.status === 'ACTIVE'
        ? 'SUSPENDED'
        : partyGroup.status === 'SUSPENDED'
        ? 'ACTIVE'
        : undefined;
    const selectedGroupStatus = nextGroupStatus === 'SUSPENDED' ? 'sospeso' : 'riabilitato';

    if (!nextGroupStatus) {
      addError({
        id: 'INVALID_STATUS_TRANSITION',
        blocking: false,
        error: new Error('INVALID_STATUS_TRANSITION'),
        techDescription: `Invalid status transition while updating group (${partyGroup.id})`,
        toNotify: true,
      });
      return;
    }
    setLoading(true);
    updatePartyGroupStatus(party, product, partyGroup, partyGroup.status)
      .then((_) => {
        fetchPartyGroup();
        addNotify({
          id: 'ACTION_ON_PARTY_GROUP_COMPLETED',
          title: `GRUPPO ${selectedGroupStatus.toUpperCase()}`,
          message: (
            <>
              {`Hai ${selectedGroupStatus} correttamente il gruppo`}
              <strong>{` ${partyGroup.name} `}</strong>
              {'.'}
            </>
          ),
          component: 'Toast',
        });
      })
      .catch((reason) =>
        addError({
          id: 'UPDATE_PARTY_GROUP_STATUS',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while updating group (${partyGroup.name}) con id (${partyGroup.id}): ${partyGroup.status} -> ${nextGroupStatus}`,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  };

  const handleOpen = () => {
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: partyGroup.status === 'ACTIVE' ? 'Sospendi Gruppo' : 'Riabilita Gruppo',
      message: (
        <>
          {partyGroup.status === 'ACTIVE'
            ? 'Stai per sospendere il gruppo'
            : 'Stai per riabilitare il gruppo'}
          <strong> {partyGroup.name} </strong>
          {'sul prodotto '}
          <strong> {productsMap[partyGroup.productId].title} </strong>
          {'.'}
          <br />
          {'Vuoi continuare?'}
        </>
      ),
      confirmLabel: 'Conferma',
      closeLabel: 'Annulla',
      onConfirm: confirmChangeStatus,
    });
  };

  const paths = [
    {
      description: 'Referenti',
      onClick: goBack,
    },
    {
      description: `${partyGroup.name}`,
    },
  ];
  console.log('group', partyGroup);
  return (
    <Grid
      container
      alignItems={'center'}
      px={2}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3}>
        <ProductNavigationBar paths={paths} />
      </Grid>
      <Grid item xs={12} mb={3}>
        <Typography variant="h1">Dettaglio Referente</Typography>
      </Grid>
      <Grid item xs={12} mb={3}>
        <GroupDetail group={partyGroup} productsMap={productsMap} />
      </Grid>
      <Grid item xs={10} mb={3} mt={15}>
        <GroupActions
          goEdit={goEdit}
          goToDuplicate={goToDuplicate}
          onDelete={onDelete}
          partyGroup={partyGroup}
          handleOpen={handleOpen}
        />
      </Grid>
    </Grid>
  );
}

export default withGroupDetail(GroupDetailPage);
