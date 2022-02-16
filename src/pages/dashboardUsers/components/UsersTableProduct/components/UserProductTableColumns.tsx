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
  onChangeState: (user: PartyUser) => void,
  productRolesLists: ProductRolesLists
) {
  return [
    {
      field: 'fullName',
      cellClassName: 'justifyContentBold',
      headerName: 'NOME',
      align: 'left',
      headerAlign: 'left',
      width: 300,
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
      width: 300,
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
      width: 300,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => showRoles(params, productRolesLists),
      renderHeader: showCustmHeader,
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
      renderCell: (p) => (canEdit ? showActions(party, p, onChangeState) : renderCell(p, '')),
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

function showName(params: GridRenderCellParams) {
  const isUserSuspended = params.row.status === 'SUSPENDED';
  return (
    <React.Fragment>
      {renderCell(
        params,
        <>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={isUserSuspended ? 7 : 12} sx={{ width: '100%' }}>
              <Typography variant="h6" color={isUserSuspended ? '#9E9E9E' : undefined}>
                {params.row.name} {params.row.surname}
              </Typography>
            </Grid>
            {isUserSuspended && (
              <Grid
                item
                xs={5}
                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
              >
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
              </Grid>
            )}
          </Grid>
        </>
      )}
    </React.Fragment>
  );
}

function showActions(
  party: Party,
  users: GridRenderCellParams<PartyUser>,
  onChangeState: (user: PartyUser) => void
) {
  const row = users.row as PartyUser;
  return (
    <React.Fragment>
      {row.isCurrentUser
        ? renderCell(users, '')
        : row.products[0].roles.length > 1
        ? renderCell(
            users,
            <Tooltip title="Le azioni sono disponibili nel dettaglio del referente">
              <InfoOutlined sx={{ color: '#5C6F82' }} />
            </Tooltip>,
            { paddingLeft: 0, paddingRight: 0, textAlign: 'center' }
          )
        : renderCell(
            users,
            <UserProductRowActions
              party={party}
              partyUser={row}
              partyUserProduct={row.products[0]}
              onChangeState={onChangeState}
            />
          )}
    </React.Fragment>
  );
}
