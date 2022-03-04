import { Grid, Typography, Chip, Link, Box } from '@mui/material';
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
  const isSuspended = partyGroup.status === 'SUSPENDED';

  useEffect(() => {
    if (partyGroup) {
      trackEvent('OPEN_USER_DETAIL', { group_id: partyGroup.id });
    }
  }, [partyGroup]);

  const goBack = () =>
    // TODO: redirect to Group Table Page
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
    updatePartyGroupStatus(party, product, partyGroup, nextGroupStatus)
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
          {'di'}
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
      description: 'Gruppi',
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
      <Grid container item mb={3}>
        <Grid item xs={6}>
          <Box display="flex">
            <Box>
              <Typography variant="h1">Dettaglio Referente</Typography>
            </Box>
            <Box>
              {isSuspended && (
                <Chip
                  label="sospeso"
                  variant="outlined"
                  sx={{
                    fontWeight: '600',
                    fontSize: '14px',
                    background: '#E0E0E0',
                    border: 'none',
                    borderRadius: '16px',
                    width: '76px',
                    height: '24px',
                    marginTop: '23px',
                    marginLeft: '20px',
                  }}
                />
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} display="flex" alignItems="center" justifyContent="flex-end">
          <Link
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={goBack}
          >
            Indietro
          </Link>
        </Grid>
      </Grid>
      <Grid item xs={12} mb={3}>
        <GroupDetail group={partyGroup} productsMap={productsMap} isSuspended={isSuspended} />
      </Grid>
      <Grid item xs={10} mb={3} mt={15}>
        <GroupActions
          goEdit={goEdit}
          goToDuplicate={goToDuplicate}
          onDelete={onDelete}
          partyGroup={partyGroup}
          handleOpen={handleOpen}
          isSuspended={isSuspended}
        />
      </Grid>
    </Grid>
  );
}

export default withGroupDetail(GroupDetailPage);
