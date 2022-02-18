import { Chip, Typography, Grid, Tooltip } from '@mui/material';
import {
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { PartyUser } from '../../../../../model/PartyUser';
import { ProductRolesLists } from '../../../../../model/ProductRole';
import { Party } from '../../../../../model/Party';
import UserProductRowActions from './UserProductRowActions';

export function buildColumnDefs(
  canEdit: boolean,
  party: Party,
  onDelete: (user: PartyUser) => void,
  productRolesLists: ProductRolesLists
) {
  return [
    {
      field: 'fullName',
      cellClassName: 'justifyContentBold',
      headerName: 'NOME',
      align: 'left',
      headerAlign: 'left',
      width: 275,
      editable: false,
      disableColumnMenu: true,
      valueGetter: getFullName,
      renderHeader: showCustmHeader,
      renderCell: showName,
      sortable: false,
    },
    {
      field: 'email',
      cellClassName: 'justifyContentNormal',
      headerName: 'EMAIL',
      align: 'left',
      headerAlign: 'left',
      width: 293,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustmHeader,
      renderCell,
      sortable: false,
    },
    {
      field: 'userRole',
      cellClassName: 'justifyContentBold',
      headerName: 'RUOLI',
      align: 'left',
      headerAlign: 'left',
      width: 250,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => showRoles(params, productRolesLists),
      renderHeader: showCustmHeader,
      sortable: false,
    },
    {
      field: 'status',
      cellClassName: 'justifyContentNormalRight',
      headerName: '',
      align: 'center',
      width: 82,
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderCell: showStatus,
      sortable: false,
    },
    {
      field: 'azioni',
      cellClassName: 'justifyContentNormalRight',
      headerName: '',
      align: 'right',
      width: 53,
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderCell: (p) => (canEdit ? showActions(party, p, onDelete) : renderCell(p, '')),
      sortable: false,
    },
  ] as Array<GridColDef>;
}

function renderCell(
  params: GridRenderCellParams,
  value: ReactNode = params.value,
  overrideStyle: CSSProperties = {}
) {
  const bgColor = params.row.status === 'SUSPENDED' ? '#EEEEEE' : 'white';
  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: '100%',
        height: '100%',
        paddingRight: '24px',
        paddingLeft: '24px',
        paddingTop: '-16px',
        paddingBottom: '-16px',
        marginTop: '16px',
        // marginBottom:'16px',
        borderBottom: '1px solid #CCD4DC',
        ...overrideStyle,
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
          paddingBottom: '8px',
          width: '100%',
          color: params.row.status === 'SUSPENDED' ? '#9E9E9E' : undefined,
          fontSize: '14px',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function getFullName(params: GridValueGetterParams) {
  return `${params.row.name} ${params.row.surname} ${params.row.status}`;
}

function showCustmHeader(params: GridColumnHeaderParams) {
  return (
    <React.Fragment>
      <Typography
        color="text.secondary"
        sx={{ fontSize: '14px', fontWeight: '700', outline: 'none', paddingLeft: 1 }}
      >
        {params.colDef.headerName}
      </Typography>
    </React.Fragment>
  );
}

function showName(params: GridRenderCellParams, canShowChip: boolean) {
  const showChip = canShowChip && params.row.status === 'SUSPENDED';
  return (
    <React.Fragment>
      {renderCell(
        params,
        <>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={showChip ? 7 : 12} sx={{ width: '100%' }}>
              <Typography variant="h6" color={showChip ? '#9E9E9E' : undefined}>
                {params.row.name} {params.row.surname} {params.row.isCurrentUser ? '(tu)' : ''}
              </Typography>
            </Grid>
            {showChip && (
              <Grid
                item
                xs={5}
                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
              >
                <TableChip text="Sospeso" />
              </Grid>
            )}
          </Grid>
        </>
      )}
    </React.Fragment>
  );
}

function TableChip({ text }: { text: string }) {
  return (
    <Chip
      label={text}
      sx={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#17324D',
        backgroundColor: '#00C5CA',
        paddingBottom: '1px',
        height: '24px',
      }}
    />
  );
}

function showRoles(params: GridRenderCellParams<PartyUser>, productRolesLists: ProductRolesLists) {
  const isUserSuspended = params.row.status === 'SUSPENDED';
  return (
    <React.Fragment>
      {renderCell(
        params,
        <Grid container direction="column">
          {(params.row as PartyUser).products[0].roles.map((r) => (
            <Grid item key={r.relationshipId}>
              <Typography
                color={isUserSuspended || r.status === 'SUSPENDED' ? '#9E9E9E' : undefined}
                sx={{ fontSize: '14px', fontWeight: '700', outline: 'none' }}
              >
                {productRolesLists.groupByProductRole[r.role]
                  ? productRolesLists.groupByProductRole[r.role].title
                  : r.role}
              </Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </React.Fragment>
  );
}

function showStatus(params: GridRenderCellParams) {
  const showChip = params.row.status === 'SUSPENDED';
  return renderCell(params, <>{showChip && <TableChip text="Sospeso" />}</>, {
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center',
  });
}

function showActions(
  party: Party,
  users: GridRenderCellParams<PartyUser>,
  onDelete: (user: PartyUser) => void
) {
  const row = users.row as PartyUser;
  return renderCell(
    users,
    row.isCurrentUser || row.products[0].roles.length > 1 ? (
      <Tooltip title="Le azioni sono disponibili nel dettaglio del referente">
        <InfoOutlined sx={{ color: '#5C6F82', paddingTop: 1, boxSizing: 'unset' }} />
      </Tooltip>
    ) : (
      <UserProductRowActions
        party={party}
        partyUser={row}
        partyUserProduct={row.products[0]}
        onDelete={onDelete}
      />
    ),
    { paddingLeft: 0, paddingRight: 0, textAlign: 'center' }
  );
}
