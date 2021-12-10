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
import { Role } from '../../../../../model/Role';
import { UserRole } from '../../../../../model/Party';
import { roleLabels } from '../../../../../utils/constants';
import SessionModal from '../../../../../components/SessionModal';
import Toast from '../../../../../components/Toast';
import CustomPagination from '../../../../../components/CustomPagination';

const rowHeight = 81;
const headerHeight = 56;

interface RolesSearchTableProps {
  users: Array<Role>;
  selectedProduct?: Product;
  page: Page;
  sort?: string;
  onPageRequest: (p: PageRequest) => void;
}

export default function RolesSearchTable({
  users,
  page,
  sort,
  onPageRequest,
}: RolesSearchTableProps) {
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
          padding: '0 10px',
          borderBottom: '1px solid #CCD4DC',
        }}
      >
        {value}
      </div>
    );
  }

  function getFullName(params: GridValueGetterParams) {
    return `${params.row.name} ${params.row.surname}`;
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

  function showLabelRef(params: GridRenderCellParams<Role>) {
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

  const columns: Array<GridColDef> = [
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
    },
    {
      field: 'stato',
      cellClassName: 'justifyContentBold',
      headerName: '',
      type: 'number',
      align: 'left',
      width: 150,
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderCell: showChip,
    },
    {
      field: 'email',
      cellClassName: 'justifyContentNormal',
      headerName: 'EMAIL',
      align: 'left',
      headerAlign: 'left',
      width: 320,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustmHeader,
      renderCell,
    },
    {
      field: 'userRole',
      cellClassName: 'justifyContentBold',
      headerName: 'RUOLO',
      align: 'left',
      headerAlign: 'left',
      type: 'number',
      width: 200,
      editable: false,
      disableColumnMenu: true,
      renderCell: showLabelRef,
      renderHeader: showCustmHeader,
    },
    {
      field: 'azione',
      cellClassName: 'justifyContentNormalRight',
      headerName: '',
      align: 'right',
      type: 'number',
      width: 99,
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderCell: showRefStatus,
    },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Role>();
  const sortSplitted = sort ? sort.split(',') : undefined;

  const selectedUserStatus = selectedUser?.status === 'SUSPENDED' ? 'sospeso' : 'riabilitato';

  const confirmChangeStatus = (user?: Role) => {
    setOpenModal(false);
    if (user?.status === 'ACTIVE') {
      // eslint-disable-next-line functional/immutable-data
      user.status = 'SUSPENDED';
    } else if (user?.status === 'SUSPENDED') {
      // eslint-disable-next-line functional/immutable-data
      user.status = 'ACTIVE';
    }

    if (user?.status) {
      setOpenToast(true);
    }
  };

  const handleOpen = (users: Role) => {
    setOpenToast(false);
    setOpenModal(true);
    setSelectedUser(users);
  };

  function showRefStatus(users: GridRenderCellParams<Role>) {
    return (
      <React.Fragment>
        {users.row.status === 'ACTIVE'
          ? renderCell(
              users,
              <Link onClick={() => handleOpen(users.row)} sx={{ cursor: 'pointer' }}>
                Sospendi
              </Link>
            )
          : renderCell(
              users,
              <Link onClick={() => handleOpen(users.row)} sx={{ cursor: 'pointer' }}>
                Riabilita
              </Link>
            )}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Box
        id="RolesSearchTableBox"
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
              <strong>{selectedUser && `${selectedUser.name} ${selectedUser.surname}.`}</strong>
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
            <strong>{selectedUser && `${selectedUser.name} ${selectedUser.surname}.`}</strong>
            <br />
            {' vuoi continuare?'}
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
