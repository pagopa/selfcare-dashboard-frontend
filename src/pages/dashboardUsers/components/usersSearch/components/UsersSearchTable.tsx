import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Chip, Link, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridSortDirection,
  GridSortModel,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import React, { ReactNode, useState } from 'react';
import { Page } from '../../../../../model/Page';
import { PageRequest } from '../../../../../model/PageRequest';
import { Product } from '../../../../../model/Product';
import { PartyUser } from '../../../../../model/PartyUser';
import { Party, UserRole, UserStatus } from '../../../../../model/Party';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS, roleLabels } from '../../../../../utils/constants';
import SessionModal from '../../../../../components/SessionModal';
import Toast from '../../../../../components/Toast';
import CustomPagination from '../../../../../components/CustomPagination';
import { updatePartyUserStatus } from '../../../../../services/usersService';
import { useAppDispatch } from '../../../../../redux/hooks';
import useLoading from '../../../../../hooks/useLoading';
import { AppError, appStateActions } from '../../../../../redux/slices/appStateSlice';

const rowHeight = 81;
const headerHeight = 56;

interface UsersSearchTableProps {
  party: Party;
  users: Array<PartyUser>;
  selectedProduct?: Product;
  page: Page;
  sort?: string;
  onPageRequest: (p: PageRequest) => void;
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

function renderCell(params: GridRenderCellParams, value: ReactNode = params.value) {
  const bgColor = params.row.status === 'SUSPENDED' ? '#E6E9F2' : 'white';
  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: '100%',
        height: '100%',
        paddingRight: '24px',
        paddingLeft:'24px', 
        paddingTop:'-16px',
        paddingBottom:'-16px',
        marginTop:'16px',
        // marginBottom:'16px',
        borderBottom: '1px solid #CCD4DC',
              }}
    >
      <div
      title={value?.toString()}
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical' as const,
        paddingBottom:'8px'
        }}>
      {value}</div>
    </div>
  );
}

function getFullName(params: GridValueGetterParams) {
  return `${params.row.name} ${params.row.surname}`;
}

function getProducts(params: GridValueGetterParams) {
  return params.row.products.map((p: Product) => p.title).join(',');
}

function showCustmHeader(params: GridColumnHeaderParams) {
  return (
    <React.Fragment>
      <Typography
        color="text.secondary"
        sx={{ fontSize: '14px', fontWeight: '700', outline: 'none' }}
      >
        {params.colDef.headerName}
      </Typography>
    </React.Fragment>
  );
}

function showLabelRef(params: GridRenderCellParams<PartyUser>) {
  return (
    <React.Fragment>
      {renderCell(params, roleLabels[params.row.userRole as UserRole].shortLabel)}
    </React.Fragment>
  );
}

function showChip(params: GridRenderCellParams) {
  return (
    <React.Fragment>
      {renderCell(
        params,
        params.row.status === 'SUSPENDED' && (
          <Chip
            label="Sospeso"
            sx={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#17324D',
              backgroundColor: '#00C5CA',
              paddingBottom: '1px',
              height: '24px',
            }}
          />
        )
      )}
    </React.Fragment>
  );
}

function showRefStatus(
  users: GridRenderCellParams<PartyUser>,
  onChangeState: (user: PartyUser) => void
) {
  return (
    <React.Fragment>
      {users.row.status === 'ACTIVE'
        ? renderCell(
            users,
            <Link onClick={() => onChangeState(users.row)} sx={{ cursor: 'pointer' }}>
              Sospendi
            </Link>
          )
        : renderCell(
            users,
            <Link onClick={() => onChangeState(users.row)} sx={{ cursor: 'pointer' }}>
              Riabilita
            </Link>
          )}
    </React.Fragment>
  );
}

function buildColumnDefs(isSelectedProduct: boolean, onChangeState: (user: PartyUser) => void) {
  return (
    [
      {
        field: 'fullName',
        cellClassName: 'justifyContentBold',
        headerName: 'NOME',
        align: 'left',
        headerAlign: 'left',
        width: 150,
        editable: false,
        disableColumnMenu: true,
        valueGetter: getFullName,
        renderHeader: showCustmHeader,
        renderCell,
        sortable: false
      },
      {
        field: 'stato',
        cellClassName: 'justifyContentBold',
        headerName: '',
        align: 'left',
        width: 134,
        hideSortIcons: true,
        disableColumnMenu: true,
        editable: false,
        renderCell: showChip,
        sortable: false
      },
      {
        field: 'email',
        cellClassName: 'justifyContentNormal',
        headerName: 'EMAIL',
        align: 'left',
        headerAlign: 'left',
        width: !isSelectedProduct ? 250 : 300,
        editable: false,
        disableColumnMenu: true,
        renderHeader: showCustmHeader,
        renderCell,
        sortable: false
      },
      {
        field: 'userRole',
        cellClassName: 'justifyContentBold',
        headerName: 'RUOLO',
        align: 'left',
        headerAlign: 'left',
        width: 200,
        editable: false,
        disableColumnMenu: true,
        renderCell: showLabelRef,
        renderHeader: showCustmHeader,
        sortable: false
      },
    ] as Array<GridColDef>
  ).concat(
    !isSelectedProduct
      ? [
          {
            field: 'products',
            cellClassName: 'justifyContentNormal',
            headerName: 'PRODOTTI',
            align: 'left',
            width: 186,
            hideSortIcons: false,
            disableColumnMenu: true,
            valueGetter: getProducts,
            editable: false,
            renderCell,
            renderHeader: showCustmHeader,
            sortable: false
          },
        ]
      : [
          {
            field: 'azione',
            cellClassName: 'justifyContentNormalRight',
            headerName: '',
            align: 'right',
            width: 134,
            hideSortIcons: true,
            disableColumnMenu: true,
            editable: false,
            renderCell: (p) => showRefStatus(p, onChangeState),
            sortable: false
          },
        ]
  );
}

export default function UsersSearchTable({
  party,
  selectedProduct,
  users,
  page,
  sort,
  onPageRequest,
}: UsersSearchTableProps) {
  const dispatch = useAppDispatch();
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  const addError = (error: AppError) => dispatch(appStateActions.addError(error));

  const [openModal, setOpenModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PartyUser>();
  const sortSplitted = sort ? sort.split(',') : undefined;

  const handleOpen = (users: PartyUser) => {
    setOpenToast(false);
    setOpenModal(true);
    setSelectedUser(users);
  };
  const columns: Array<GridColDef> = buildColumnDefs(!!selectedProduct, handleOpen);

  const selectedUserStatus = selectedUser?.status === 'SUSPENDED' ? 'sospeso' : 'riabilitato';

  const confirmChangeStatus = (user?: PartyUser) => {
    if (user && selectedProduct) {
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
      updatePartyUserStatus(party, selectedProduct, user, nextStatus)
        .then((_) => {
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
          width: '100%',
          border: 'none',
          px: '16px',
        }}
        justifyContent="start"
      >
        <CustomDataGrid
          className="CustomDataGrid"
          autoHeight={true}
          rows={users}
          columns={columns}
          pageSize={page.size}
          rowsPerPageOptions={[20]}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          hideFooterSelectedRowCount={true}
          components={{
            Pagination: () => (
              <CustomPagination sort={sort} page={page} onPageRequest={onPageRequest} />
            ),
            ColumnSortedAscendingIcon: () => <ArrowDropUp sx={{ color: '#5C6F82' }} />,
            ColumnSortedDescendingIcon: () => <ArrowDropDown sx={{ color: '#5C6F82' }} />,
          }}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          onSortModelChange={(model: GridSortModel) =>
            onPageRequest({
              page: page.number,
              size: page.size,
              sort: model.length > 0 ? model.map((m) => `${m.field},${m.sort}`)[0] : undefined,
            })
          }
          sortModel={
            sortSplitted
              ? [{ field: sortSplitted[0], sort: sortSplitted[1] as GridSortDirection }]
              : undefined
          }
        />
      </Box>
      {openToast && (
        <Toast
          title={`REFERENTE ${selectedUserStatus?.toUpperCase()}`}
          message={
            <>
              {`Hai ${selectedUserStatus} correttamente `}
              <strong>{selectedUser && `${selectedUser.name} ${selectedUser.surname}`}</strong>
              {'.'}
            </>
          }
          closeToast={() => setOpenToast(false)}
        />
      )}
      <SessionModal
        open={openModal}
        title="Sospendi Referente"
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
