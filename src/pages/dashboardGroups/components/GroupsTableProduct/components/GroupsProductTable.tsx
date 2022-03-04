import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, styled } from '@mui/material';
import { DataGrid, GridColDef, GridSortDirection, GridSortModel } from '@mui/x-data-grid';
import React, { useMemo } from 'react';
import { Product } from '../../../../../model/Product';
import { Party } from '../../../../../model/Party';
import { PartyGroup, PartyGroupStatus } from '../../../../../model/PartyGroup';
import { buildColumnDefs } from './GroupProductTableColumns';

const rowHeight = 81;
const headerHeight = 56;

interface GroupsTableProps {
  party: Party;
  groups: Array<PartyGroup>;
  product: Product;
  canEdit: boolean;
  sort?: string;
  onSortRequest: (sort: string) => void;
  onRowClick: (partyGroup: PartyGroup) => void;
  onDelete: (partyGroup: PartyGroup) => void;
  onStatusUpdate: (partyGroup: PartyGroup, nextStatus: PartyGroupStatus) => void;
}

const CustomDataGrid = styled(DataGrid)({
  border: 'none !important',
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
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

export default function GroupsProductTable({
  party,
  product,
  canEdit,
  groups,
  sort,
  onSortRequest,
  onRowClick,
  onDelete,
  onStatusUpdate,
}: GroupsTableProps) {
  const sortSplitted = sort && sort !== '' ? sort.split(',') : undefined;

  const columns: Array<GridColDef> = useMemo(
    () => buildColumnDefs(canEdit, party, product, onRowClick, onDelete, onStatusUpdate),
    [party, product]
  );

  return (
    <React.Fragment>
      <Box
        id="GroupsSearchTableBox"
        sx={{
          position: 'relative',
          width: '100% !important',
          border: 'none',
        }}
        justifyContent="start"
      >
        <CustomDataGrid
          className="CustomDataGrid"
          autoHeight={true}
          rows={groups}
          getRowId={(r) => r.id}
          columns={columns}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          hideFooterSelectedRowCount={true}
          hideFooter={true}
          hideFooterPagination={true}
          components={{
            ColumnSortedAscendingIcon: () => <ArrowDropDown sx={{ color: '#5C6F82' }} />,
            ColumnSortedDescendingIcon: () => <ArrowDropUp sx={{ color: '#5C6F82' }} />,
          }}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          onSortModelChange={(model: GridSortModel) =>
            onSortRequest(model.map((m) => `${m.field},${m.sort}`)[0] ?? '')
          }
          sortModel={
            sortSplitted
              ? [{ field: sortSplitted[0], sort: sortSplitted[1] as GridSortDirection }]
              : []
          }
        />
      </Box>
    </React.Fragment>
  );
}
