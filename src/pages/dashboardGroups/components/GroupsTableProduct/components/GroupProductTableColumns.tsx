import { Chip, Typography, Grid } from '@mui/material';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { PartyGroup, PartyGroupStatus } from '../../../../../model/PartyGroup';
import GroupProductRowActions from './GroupProductRowActions';

export function buildColumnDefs(
  canEdit: boolean,
  party: Party,
  product: Product,
  onRowClick: (partyGroup: PartyGroup) => void,
  onDelete: (partyGroup: PartyGroup) => void,
  onStatusUpdate: (partyGroup: PartyGroup, nextStatus: PartyGroupStatus) => void
) {
  return [
    {
      field: 'name',
      cellClassName: 'justifyContentBold',
      headerName: 'NOME',
      align: 'left',
      headerAlign: 'left',
      width: 275, // TODO fix column sizes
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustmHeader,
      renderCell: (params) => showName(params, false, onRowClick),
      sortable: false,
    },
    {
      field: 'description',
      cellClassName: 'justifyContentNormal',
      headerName: 'DESCRIZIONE',
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
      headerName: 'PRODOTTO',
      align: 'left',
      headerAlign: 'left',
      width: 250,
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
      headerName: '',
      align: 'center',
      width: 82,
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      valueGetter: (params) => (params.row as PartyGroup).membersIds.length,
      renderCell: (params) => showStatus(params, onRowClick),
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
      renderCell: (p) =>
        canEdit
          ? showActions(party, product, p, onDelete, onStatusUpdate)
          : renderCell(p, '', onRowClick), // TODO show Duplica button
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
        ...overrideStyle,
      }}
      onClick={onRowClick ? () => onRowClick(params.row) : undefined}
    >
      <div
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
        fontSize: '16px',
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
