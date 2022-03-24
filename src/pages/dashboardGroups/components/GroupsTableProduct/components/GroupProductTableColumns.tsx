import { Chip, Typography, Grid } from '@mui/material';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { TFunction } from 'react-i18next';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { PartyGroup, PartyGroupStatus } from '../../../../../model/PartyGroup';
import { DASHBOARD_ROUTES } from '../../../../../routes';
import GroupProductRowActions from './GroupProductRowActions';

export function buildColumnDefs(
  canEdit: boolean,
  party: Party,
  product: Product,
  onRowClick: (partyGroup: PartyGroup) => void,
  onDelete: (partyGroup: PartyGroup) => void,
  onStatusUpdate: (partyGroup: PartyGroup, nextStatus: PartyGroupStatus) => void,
  t: TFunction<'translation', undefined>
) {
  return [
    {
      field: 'name',
      cellClassName: 'justifyContentBold',
      headerName: t('dashboardGroup.groupProductTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      width: 165,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustmHeader,
      renderCell: (params) => showName(params, false, onRowClick),
      sortable: true,
    },
    {
      field: 'description',
      cellClassName: 'justifyContentNormal',
      headerName: t('dashboardGroup.groupProductTableColumns.headerFields.description'),
      align: 'left',
      headerAlign: 'left',
      width: 293,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustmHeader,
      renderCell: (params) => renderCell(params, undefined, onRowClick),
      sortable: false,
    },
    {
      field: 'productId',
      cellClassName: 'justifyContentBold',
      headerName: t('dashboardGroup.groupProductTableColumns.headerFields.product'),
      align: 'left',
      headerAlign: 'left',
      width: 200,
      editable: false,
      disableColumnMenu: true,
      valueGetter: () => product.title,
      renderCell: (params) => renderCell(params, undefined, onRowClick),
      renderHeader: showCustmHeader,
      sortable: false,
    },
    {
      field: 'referenti',
      cellClassName: 'justifyContentNormalRight',
      headerName: t('dashboardGroup.groupProductTableColumns.headerFields.referents'),
      align: 'center',
      width: 120,
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      valueGetter: (params) => (params.row as PartyGroup).membersCount,
      renderCell: (params) => renderCell(params, undefined, onRowClick),
      renderHeader: showCustmHeader,
      sortable: false,
    },
    {
      field: 'status',
      cellClassName: 'justifyContentNormalRight',
      headerName: '',
      align: 'center',
      width: 75,
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderCell: (params) => showStatus(params, onRowClick),
      sortable: false,
    },
    {
      field: 'azioni',
      cellClassName: 'justifyContentNormalRight',
      headerName: '',
      align: 'right',
      width: 100,
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderCell: (p) =>
        canEdit
          ? showActions(party, product, p, onDelete, onStatusUpdate)
          : renderCell(
              p,
              <Typography variant="h6">
                <Link
                  to={resolvePathVariables(
                    DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_CLONE.path,
                    {
                      institutionId: party.institutionId,
                      groupId: (p.row as PartyGroup).id,
                    }
                  )}
                >
                  {t('dashboardGroup.groupProductTableColumns.duplicateActionLink')}
                </Link>
              </Typography>
            ),
      sortable: false,
    },
  ] as Array<GridColDef>;
}

function renderCell(
  params: GridRenderCellParams,
  value: ReactNode = params.value,
  onRowClick?: (partyGroup: PartyGroup) => void,
  overrideStyle: CSSProperties = {}
) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        paddingRight: '24px',
        paddingLeft: '24px',
        paddingTop: '-16px',
        paddingBottom: '-16px',
        marginTop: '16px',
        // marginBottom:'16px',
        borderBottom: '1px solid #CCD4DC',
        cursor: 'pointer',
        WebkitBoxOrient: 'vertical' as const,
        ...overrideStyle,
      }}
      onClick={onRowClick ? () => onRowClick(params.row) : undefined}
    >
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
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

function isGroupSuspended(partyGroup: PartyGroup): boolean {
  return partyGroup.status === 'SUSPENDED';
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

function showName(
  params: GridRenderCellParams,
  canShowChip: boolean,
  onRowClick: (partyGroup: PartyGroup) => void
) {
  const isSuspended = isGroupSuspended(params.row as PartyGroup);
  const showChip = canShowChip && isSuspended;
  return (
    <React.Fragment>
      {renderCell(
        params,
        <>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={showChip ? 7 : 12} sx={{ width: '100%' }}>
              <Typography variant="h6" color={isSuspended ? '#9E9E9E' : undefined}>
                {params.row.name}
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
        </>,
        onRowClick
      )}
    </React.Fragment>
  );
}

function TableChip({ text }: { text: string }) {
  return (
    <Chip
      label={text}
      sx={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#17324D',
        backgroundColor: '#E0E0E0',
        paddingBottom: '1px',
        height: '24px',
      }}
    />
  );
}

function showStatus(params: GridRenderCellParams, onRowClick: (partyGroup: PartyGroup) => void) {
  const showChip = isGroupSuspended(params.row as PartyGroup);
  return renderCell(params, <>{showChip && <TableChip text="Sospeso" />}</>, onRowClick, {
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center',
  });
}

function showActions(
  party: Party,
  product: Product,
  params: GridRenderCellParams<PartyGroup>,
  onDelete: (partyGroup: PartyGroup) => void,
  onStatusUpdate: (partyGroup: PartyGroup, nextStatus: PartyGroupStatus) => void
) {
  const row = params.row as PartyGroup;
  return renderCell(
    params,
    <GroupProductRowActions
      party={party}
      product={product}
      partyGroup={row}
      onDelete={onDelete}
      onStatusUpdate={onStatusUpdate}
    />,
    undefined,
    { paddingLeft: 0, paddingRight: 0, textAlign: 'center' }
  );
}
