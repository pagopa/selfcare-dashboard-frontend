import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, styled } from '@mui/system';
import { DataGrid, GridColDef, GridSortDirection, GridSortModel } from '@mui/x-data-grid';
import React, { useState } from 'react';
import SessionModal from '@pagopa/selfcare-common-frontend/components/SessionModal';
import Toast from '@pagopa/selfcare-common-frontend/components/Toast';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Product } from '../../../../../model/Product';
import { PartyUser } from '../../../../../model/PartyUser';
import { Party, UserStatus } from '../../../../../model/Party';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../../../utils/constants';
import { updatePartyUserStatus } from '../../../../../services/usersService';
import { buildColumnDefs } from './UserProductTableColumns';
import UserProductLoading from './UserProductLoading';
import UserTableLoadMoreData from './UserProductLoadMoreData';

const rowHeight = 81;
const headerHeight = 56;

interface UsersSearchTableProps {
  loading: boolean;
  noMoreData: boolean;
  party: Party;
  users: Array<PartyUser>;
  product: Product;
  canEdit: boolean;
  fetchNextPage: () => void;
  sort?: string;
  onSortRequest: (sort: string) => void;
}

const CustomDataGrid = styled(DataGrid)({
  border: 'none !important',
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
    { outline: 'none' },
  '&.MuiDataGrid-root .MuiDataGrid-cell': {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
    lineHeight: '25px !important',
  },
  '&.MuiDataGrid-columnHeaders': { borderBottom: 'none !important' },
  '.justifyContentBold': {
    fontSize: '16px',
    fontWeight: '600',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
    },
  },
  '.MuiDataGrid-columnSeparator': { display: 'none' },
  '.MuiDataGrid-cell ': { padding: '0px', borderBottom: 'none' },
  '.MuiDataGrid-columnHeaders': { borderBottom: 'none' },
  '.MuiDataGrid-row': {
    borderBottom: '1px solid #CCD4DC',
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      '&:hover': { backgroundColor: 'transparent' },
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  '.justifyContentNormal': {
    fontSize: '16px',
    fontWeight: 'normal',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
    },
  },
  '.justifyContentNormalRight': {
    fontSize: '16px',
    fontWeight: 'normal',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
      justifyContent: 'right',
    },
  },
  '.MuiButtonBase-root.MuiPaginationItem-root': {
    fontSize: '16px',
    fontWeight: '600 !important',
    color: '#0073E6',
    '&.Mui-selected ': {
      border: 'none !important',
      backgroundColor: 'transparent !important',
      color: '#000000',
    },
  },
});

export default function UsersProductTable({
  loading,
  fetchNextPage,
  noMoreData,
  party,
  product,
  canEdit,
  users,
  sort,
  onSortRequest,
}: UsersSearchTableProps) {
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  const addError = useErrorDispatcher();
  const [openModal, setOpenModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PartyUser>();

  const sortSplitted = sort ? sort.split(',') : undefined;

  const handleOpen = (users: PartyUser) => {
    setOpenToast(false);
    setOpenModal(true);
    setSelectedUser(users);
  };
  const columns: Array<GridColDef> = buildColumnDefs(canEdit, handleOpen);

  const selectedUserStatus = selectedUser?.status === 'SUSPENDED' ? 'sospeso' : 'riabilitato';

  const confirmChangeStatus = (user?: PartyUser) => {
    if (user && canEdit) {
      const nextStatus: UserStatus | undefined =
        user.status === 'ACTIVE' ? 'SUSPENDED' : user.status === 'SUSPENDED' ? 'ACTIVE' : undefined;
      if (!nextStatus) {
        addError({
          id: 'INVALID_STATUS_TRANSITION',
          blocking: false,
          error: new Error('INVALID_STATUS_TRANSITION'),
          techDescription: `Invalid status transition while updating party (${party.institutionId}) user (${user.id}): ${user.status}`,
          toNotify: true,
        });

        return;
      }

      setLoading(true);
      updatePartyUserStatus(user, nextStatus)
        .then((_) => {
          if (nextStatus === 'SUSPENDED') {
            trackEvent('USER_SUSPEND', {
              party_id: party.institutionId,
              product: product.id,
              product_role: user.userRole,
            });
          } else if (nextStatus === 'ACTIVE') {
            trackEvent('USER_RESUME', {
              party_id: party.institutionId,
              product: product.id,
              product_role: user.userRole,
            });
          }
          setOpenModal(false);
          // eslint-disable-next-line functional/immutable-data
          user.status = nextStatus;

          setOpenToast(true);
        })
        .catch((reason) =>
          addError({
            id: 'UPDATE_PARTY_USER_STATUS',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while updating party (${party.institutionId}) user (${user.id}): ${user.status} -> ${nextStatus}`,
            toNotify: true,
          })
        )
        .finally(() => setLoading(false));
    }
  };

  return (
    <React.Fragment>
      <Box
        id="UsersSearchTableBox"
        sx={{
          position: 'relative',
          width: '100% !important',
          border: 'none',
          px: '16px',
        }}
        justifyContent="start"
      >
        <CustomDataGrid
          className="CustomDataGrid"
          autoHeight={true}
          rows={users}
          getRowId={(r) => r.id}
          columns={columns}
          rowHeight={rowHeight /* to remove? */}
          headerHeight={headerHeight}
          components={{
            Footer: () =>
              loading ? (
                <UserProductLoading />
              ) : !noMoreData ? (
                <UserTableLoadMoreData fetchNextPage={fetchNextPage} />
              ) : (
                <></>
              ),
            ColumnSortedAscendingIcon: () => <ArrowDropUp sx={{ color: '#5C6F82' }} />,
            ColumnSortedDescendingIcon: () => <ArrowDropDown sx={{ color: '#5C6F82' }} />,
          }}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          onSortModelChange={(model: GridSortModel) =>
            onSortRequest(model.map((m) => `${m.field},${m.sort}`)[0])
          }
          sortModel={
            sortSplitted
              ? [{ field: sortSplitted[0], sort: sortSplitted[1] as GridSortDirection }]
              : undefined
          }
        />
      </Box>
      <Toast
        open={openToast}
        title={`REFERENTE ${selectedUserStatus?.toUpperCase()}`}
        message={
          <>
            {`Hai ${selectedUserStatus} correttamente `}
            <strong>{selectedUser && `${selectedUser.name} ${selectedUser.surname}`}</strong>
            {'.'}
          </>
        }
        onCloseToast={() => setOpenToast(false)}
      />
      <SessionModal
        open={openModal}
        title={selectedUser?.status === 'ACTIVE' ? 'Sospendi Referente' : 'Riabilita Referente'}
        message={
          <>
            {selectedUser?.status === 'ACTIVE' ? 'Stai per sospendere ' : 'Stai per riabilitare '}
            <strong>{selectedUser && `${selectedUser.name} ${selectedUser.surname}`}</strong>
            {'.'}
            <br />
            {'Vuoi continuare?'}
          </>
        }
        onConfirm={() => confirmChangeStatus(selectedUser)}
        handleClose={() => setOpenModal(false)}
        onConfirmLabel="Conferma"
        onCloseLabel="Annulla"
        height="100%"
      />
    </React.Fragment>
  );
}
