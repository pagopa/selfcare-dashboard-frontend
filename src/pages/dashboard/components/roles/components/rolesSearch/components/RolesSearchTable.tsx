// import { ArrowDropDown } from '@mui/icons-material';
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
import React, { ReactNode } from 'react';
import { Page } from '../../../../../../../model/Page';
import { PageRequest } from '../../../../../../../model/PageRequest';
import { Product } from '../../../../../../../model/Product';
import { Role } from '../../../../../../../model/Role';
import { roleLabels } from '../../../../../../../utils/constants';
import CustomPagination from './../../../../../../../components/CustomPagination';

const rowHeight = 81;
const headerHeight = 56;

const CustomDataGrid = styled(DataGrid)({
  border: 'none !important',
  '.MuiDataGrid-columnSeparator': { display: 'none' },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
    { outline: 'none' },
  '.MuiDataGrid-cell ': { padding: '0px', borderBottom: 'none' },
  '.MuiDataGrid-columnHeaders': { borderBottom: 'none' },
  '.MuiDataGrid-row': {
    borderBottom: '1px solid #17324D',
    // marginBottom: `${rowMargin}px`
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      '&:hover': { backgroundColor: 'transparent' },
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  '&.MuiDataGrid-root .MuiDataGrid-cell': {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
    lineHeight: '25px !important',
    '&.MuiDataGrid-cell>div': { display: 'flex', alignItems: 'center' },
  },
  '&.MuiDataGrid-columnHeaders': { borderBottom: 'none !important' },
  '&.Bold_16_600': { fontSize: '16px', fontWeight: '600' },
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
  '.MuiTablePagination-root': { display: 'none' },
});
function renderCell(params: GridRenderCellParams, value: ReactNode = params.value) {
  const bgColor = params.row.status === 'SUSPENDED' ? '#E6E9F2' : undefined;
  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: '100%',
        height: '100%',
        padding: '0 10px',
        borderBottom: '1px solid #17324D',
      }}
    >
      {value}
    </div>
  );
}

function getFullName(params: GridValueGetterParams) {
  return `${params.getValue(params.id, 'name') || ''} ${
    params.getValue(params.id, 'surname') || ''
  }`;
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
      {/* TODO: handleSortIcons */}
      {/* <ArrowDropDown sx={{ color: '#5C6F82' }} /> */}
    </React.Fragment>
  );
}

function showRefStatus(params: GridRenderCellParams<Role>) {
  return (
    <React.Fragment>
      {params.row.status === 'ACTIVE'
        ? renderCell(params, <Link>Sospendi</Link>)
        : renderCell(params, <Link>Riabilita</Link>)}
    </React.Fragment>
  );
}

function showLabelRef(params: GridRenderCellParams<Role>) {
  return <React.Fragment>{renderCell(params, roleLabels[params.row.platformRole])}</React.Fragment>;
}

function showChip(params: GridRenderCellParams) {
  return (
    <React.Fragment>
      {params.row.status === 'SUSPENDED' &&
        renderCell(
          params,
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
        )}
    </React.Fragment>
  );
}

const columns: Array<GridColDef> = [
  {
    field: 'fullName',
    cellClassName: 'Bold_16_600',
    headerName: 'NOME',
    align: 'left',
    headerAlign: 'left',
    width: 150,
    editable: false,
    disableColumnMenu: true,
    valueGetter: getFullName,
    // hideSortIcons: true,
    renderHeader: showCustmHeader,
    renderCell,
  },
  {
    field: 'stato',
    cellClassName: 'Bold_16_600',
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
    headerName: 'EMAIL',
    align: 'left',
    headerAlign: 'left',
    width: 320,
    editable: false,
    disableColumnMenu: true,
    // hideSortIcons: true,
    renderHeader: showCustmHeader,
    renderCell,
  },
  {
    field: 'platformRole',
    cellClassName: 'Bold_16_600',
    headerName: 'REFERENTI',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    width: 200,
    editable: false,
    disableColumnMenu: true,
    renderCell: showLabelRef,
    // renderCell,
    // hideSortIcons: true,
    renderHeader: showCustmHeader,
  },
  {
    field: 'azione',
    headerName: '',
    align: 'center',
    type: 'number',
    width: 99,
    hideSortIcons: true,
    disableColumnMenu: true,
    editable: false,
    renderCell: showRefStatus,
  },
];

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
  // useLayoutEffect(() => {
  //     const wrappingBox= document.getElementById('RolesSearchTableBox');
  //   if(wrappingBox){
  //     // const headerHeight = parseInt((document.querySelector('.MuiDataGrid-columnHeaders') as HTMLElement)?.style.height.replace('px', ''), 10);
  //     // const tableBodyHeight = parseInt((document.querySelector('.MuiDataGrid-virtualScrollerContent') as HTMLElement)?.style.height.replace('px', ''), 10);

  //     // eslint-disable-next-line functional/immutable-data
  //     wrappingBox.style.height= `${headerHeight + (rowHeight*users.length) + 52}px` ;
  //   }
  // });
  const sortSplitted = sort ? sort.split(',') : undefined;
  // const userSuspended = users.map( u => u.status === 'SUSPENDED');
  return (
    <Box
      id="RolesSearchTableBox"
      sx={{
        height: `${headerHeight + rowHeight * users.length + 52}px`,
        position: 'relative',
        width: '100%',
        border: 'none',
        px: '16px',
      }}
      justifyContent="start"
    >
      <CustomDataGrid
        className="CustomDataGrid"
        rows={users}
        columns={columns}
        pageSize={users.length}
        rowsPerPageOptions={[20]}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        hideFooterSelectedRowCount={true}
        components={
          users.length > 20
            ? {
                Pagination: () => (
                  <CustomPagination sort={sort} page={page} onPageRequest={onPageRequest} />
                ),
              }
            : {}
        }
        // componentsProps={{
        //   row: {
        //     style: { borderBottom:'1px solid black'  },
        //   },
        // }}
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
  );
}
