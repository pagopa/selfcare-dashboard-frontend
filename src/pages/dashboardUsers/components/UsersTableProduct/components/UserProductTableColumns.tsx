import { Chip, Link, Typography, Grid } from '@mui/material';
import {
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import React, { ReactNode } from 'react';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { Product } from '../../../../../model/Product';
import { PartyUser } from '../../../../../model/PartyUser';
import { UserRole } from '../../../../../model/Party';
import { ProductRolesLists } from '../../../../../model/ProductRole';

export function buildColumnDefs(
  isSelectedProduct: boolean,
  onChangeState: (user: PartyUser) => void,
  _productRolesLists: ProductRolesLists // TODO use this to print productRole
) {
  return (
    [
      {
        field: 'fullName',
        cellClassName: 'justifyContentBold',
        headerName: 'NOME',
        align: 'left',
        headerAlign: 'left',
        width: 284,
        editable: false,
        disableColumnMenu: true,
        valueGetter: getFullName,
        renderHeader: showCustmHeader,
        renderCell: showChip,
        sortable: false,
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
        sortable: false,
      },
      {
        field: 'userRole',
        cellClassName: 'justifyContentBold',
        headerName: 'RUOLO',
        align: 'left',
        headerAlign: 'left',
        width: !isSelectedProduct ? 233 : 235,
        editable: false,
        disableColumnMenu: true,
        renderCell: showRole,
        renderHeader: showCustmHeader,
        sortable: false,
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
            sortable: false,
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
            sortable: false,
          },
        ]
  );
}

function renderCell(params: GridRenderCellParams, value: ReactNode = params.value) {
  const bgColor = params.row.status === 'SUSPENDED' ? '#E6E9F2' : 'white';
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

function showRole(params: GridRenderCellParams<PartyUser>) {
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
        <>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={params.row.status === 'SUSPENDED' ? 7 : 12} sx={{ width: '100%' }}>
              <Typography variant="h6">
                {params.row.name} {params.row.surname}
              </Typography>
            </Grid>
            {params.row.status === 'SUSPENDED' && (
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

function showRefStatus(
  users: GridRenderCellParams<PartyUser>,
  onChangeState: (user: PartyUser) => void
) {
  return (
    <React.Fragment>
      {users.row.isCurrentUser
        ? renderCell(users, '')
        : users.row.status === 'ACTIVE'
        ? renderCell(
            users,
            <Link onClick={() => onChangeState(users.row)} sx={{ cursor: 'pointer' }}>
              Sospendi
            </Link>
          )
        : users.row.status === 'SUSPENDED'
        ? renderCell(
            users,
            <Link onClick={() => onChangeState(users.row)} sx={{ cursor: 'pointer' }}>
              Riabilita
            </Link>
          )
        : renderCell(users, '')}
    </React.Fragment>
  );
}
