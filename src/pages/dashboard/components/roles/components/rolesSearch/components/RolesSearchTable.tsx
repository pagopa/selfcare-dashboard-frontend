import { Chip, Link, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import React  from 'react';
import { Page } from '../../../../../../../model/Page';
import { PageRequest } from '../../../../../../../model/PageRequest';
import { Product } from '../../../../../../../model/Product';
import { Role } from '../../../../../../../model/Role';

const CustomDataGrid = styled(DataGrid)({
  border:'none !important',
  '.MuiDataGrid-columnSeparator': { display:'none' },
  
});

function getFullName(params: GridValueGetterParams) {
  return `${params.getValue(params.id, 'name') || ''} ${
    params.getValue(params.id, 'surname') || ''
  }`;
}

const columns: Array<GridColDef> = [
  {
    field:'fullName',
    headerName: 'NOME',
    align: 'left',
    headerAlign: 'left',
    width: 150,
    editable: false,
    valueGetter: getFullName,
  },
  {
    field: 'stato',
    headerName: '',
    type: 'number',
    align: 'left',
    width: 150,
    hideSortIcons: true,
    disableColumnMenu: true,
    editable: false,
    renderCell: (params: GridRenderCellParams) => {
      console.log('PARAMS', params.row.status);
      return(
      <React.Fragment>
        {params.row.status === 'SUSPENDED'
        ? <Chip
        label='Sospeso'
        sx={{
          fontSize:'16px',
          fontWeight:'600',
          color: '#17324D',
          backgroundColor: '#00C5CA',
          paddingBottom:'1px',
          height:'24px'
        }}
      /> 
        : undefined}
      </React.Fragment>
    );}
    
  },
  {
    field: 'email',
    headerName: 'EMAIL',
    align: 'left',
    headerAlign: 'left',
    width: 320,
    editable: false,
    disableColumnMenu: true,
  },
  {
    field: 'platformRole',
    headerName: 'REFERENTI',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    width: 200,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<Role>) =>
      <React.Fragment>
        {params.row.platformRole === 'ADMIN_REF'? <Typography >Amministrativo</Typography> : params.row.platformRole === 'TECH_REF' ? <Typography >Operativo</Typography> : params.row.platformRole === 'TECH_REF' ? <Typography >Operativo</Typography> : undefined}
      </React.Fragment>
  },
  {
    field: 'azione',
    headerName: '',
    align: 'center',
    type: 'number',
    width: 100,
    hideSortIcons: true,
    disableColumnMenu: true,
    editable: false,
    renderCell: (params: GridRenderCellParams<Role>) => 
    <React.Fragment>
        {params.row.status === 'ACTIVE'
        ? <Link >Sospendi</Link>
        : <Link >Riabilita</Link>}
      </React.Fragment>
  }
];

interface RolesSearchTableProps {
  users: Array<Role>; // righe tabella
  selectedProduct?: Product; // prodotto selezionato undefined = non + presente il prodotto
  page: Page;
  sort?: string;
  onPageRequest: (p: PageRequest) => void;
}



export default function RolesSearchTable(props: RolesSearchTableProps) {
  
  return (
    <Box className='BoxDataGrid' sx={{height:'243px', width:'100%', border:'none', px:'16px'}} justifyContent="start">
      <CustomDataGrid
        className='CustomDataGrid'
        rows={props.users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        
      />
    </Box>
  );
}
