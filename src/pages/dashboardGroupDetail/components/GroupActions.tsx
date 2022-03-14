import { Button, Grid } from '@mui/material';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import { deletePartyGroup, updatePartyGroupStatus } from '../../../services/groupsService';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import { PartyGroupExt, PartyGroupStatus } from '../../../model/PartyGroup';
import { Party } from '../../../model/Party';
import { Product, ProductsMap } from '../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../routes';

type Props = {
  partyGroup: PartyGroupExt;
  isSuspended: boolean;
  goBack: () => void;
  party: Party;
  product: Product;
  productsMap: ProductsMap;
  fetchPartyGroup: () => void;
  onGroupStatusUpdate: (nextGroupStatus: PartyGroupStatus) => void;
  nextGroupStatus: PartyGroupStatus | undefined;
};
export default function GroupActions({
  partyGroup,
  isSuspended,
  goBack,
  party,
  product,
  productsMap,
  onGroupStatusUpdate,
  nextGroupStatus,
}: Props) {
  const selectedGroupStatus = nextGroupStatus === 'SUSPENDED' ? 'sospeso' : 'riattivato';
  const selectedGroupStatusError =
    partyGroup.status === 'SUSPENDED' ? 'sospensione' : 'riattivazione';

  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();
  const history = useHistory();

  const goEdit = () =>
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_EDIT.path, {
        institutionId: partyGroup.institutionId,
        groupId: partyGroup.id,
      })
    );

  const goToDuplicate = () =>
    history.push(
      resolvePathVariables('' /* TODO: redirect to Group Duplicate Page */, {
        institutionId: partyGroup.institutionId,
        // groupId: partyGroup.id,
      })
    );

  const handleOpenDelete = () => {
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: 'Elimina gruppo',
      message: (
        <>
          {'Stai per eliminare il gruppo '}
          <strong>{partyGroup.name}</strong>
          {'.'}
          <br />
          {'Vuoi continuare?'}
        </>
      ),
      confirmLabel: 'Conferma',
      closeLabel: 'Annulla',
      onConfirm: onDelete,
    });
  };

  const onDelete = () => {
    setLoading(true);
    deletePartyGroup(party, product, partyGroup)
      .then((_) => {
        goBack();
        addNotify({
          component: 'Toast',
          id: 'DELETE_PARTY_USER',
          title: 'GRUPPO ELIMINATO',
          message: (
            <>
              {'Hai eliminato correttamente il gruppo '}
              <strong>{partyGroup.name}</strong>
              {'.'}
            </>
          ),
        });
      })
      .catch((reason) =>
        addError({
          component: 'Toast',
          id: `DELETE_PARTY_GROUP_ERROR-${partyGroup.id}`,
          displayableTitle: "ERRORE DURANTE L'ELIMINAZIONE",
          techDescription: `C'è stato un errore durante l'eliminazione del gruppo ${partyGroup.name}`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: (
            <>
              {"C'è stato un errore durante l'eliminazione del gruppo "}
              <strong>{` ${partyGroup.name} `}</strong>
              {'.'}
            </>
          ),
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

  const confirmChangeStatus = () => {
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
        onGroupStatusUpdate(nextGroupStatus);
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
          component: 'Toast',
          id: `'UPDATE_PARTY_GROUP_ERROR-${partyGroup.id}`,
          displayableTitle: `ERRORE DURANTE LA ${selectedGroupStatusError.toUpperCase()} DEL GRUPPO `,
          techDescription: `C'è stato un errore durante la ${selectedGroupStatusError} del gruppo (${partyGroup.name}) con id (${partyGroup.id}): ${partyGroup.status}`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: (
            <>
              {`C'è stato un errore durante la ${selectedGroupStatusError} del gruppo`}
              <strong>{` ${partyGroup.name} `}</strong>
              {'.'}
            </>
          ),
        })
      )
      .finally(() => setLoading(false));
  };

  return (
    <Grid container spacing={4}>
      {!isSuspended && (
        <Grid item xs={3}>
          <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={goEdit}>
            Modifica
          </Button>
        </Grid>
      )}
      <Grid item xs={3}>
        <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={handleOpen}>
          {partyGroup.status === 'SUSPENDED'
            ? 'Riattiva'
            : partyGroup.status === 'ACTIVE'
            ? 'Sospendi'
            : ''}
        </Button>
      </Grid>
      {!isSuspended && (
        <Grid item xs={3}>
          <Button
            variant="contained"
            sx={{ height: '40px', width: '100%' }}
            onClick={goToDuplicate}
          >
            Duplica
          </Button>
        </Grid>
      )}
      <Grid item xs={3}>
        <Button
          variant="outlined"
          color="error"
          sx={{ height: '40px', width: '100%' }}
          onClick={handleOpenDelete}
        >
          Elimina
        </Button>
      </Grid>
    </Grid>
  );
}
