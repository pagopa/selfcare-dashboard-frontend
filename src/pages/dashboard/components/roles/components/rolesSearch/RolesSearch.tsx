import { Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import ClearIcon from '@mui/icons-material/Clear';

import { useEffect, useState } from 'react';
import { Product } from '../../../../../../model/Product';
import { Role } from '../../../../../../api/generated/party-process/Role';
import { Page } from '../../../../../../model/Page';
import { PageRequest } from '../../../../../../model/PageRequest';
import RolesSearchTable from './components/RolesSearchTable';
import RolesSearchFilter, { RolesSearchFilterConfig } from './components/RolesSearchFilter';

interface RolesSearchProps {
  selectedProduct?: Product;
}

export default function RolesSearch({ selectedProduct }: RolesSearchProps) {
  const [users, setUsers] = useState<Array<Role>>([]);
  const [page, setPage] = useState<Page>({ number: 0, size: 0, totalElements: 0, totalPages: 0 });
  const [filter, setFilter] = useState<RolesSearchFilterConfig>(
    selectedProduct ? { product: selectedProduct.id } : {}
  );
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 0,
    size: process.env.REACT_APP_ROLES_PAGE_SIZE,
  });
  const fetchUsers = (_f: RolesSearchFilterConfig, _pageRequest: PageRequest) => {
    // TODO Fetch
    setUsers([]); // TODO (fare setUser con mio createData) e setPage
    setPage(page);
  };

  useEffect(() => {
    fetchUsers(filter, pageRequest);
  }, []);

  const handleFilterChange = (f: RolesSearchFilterConfig) => {
    setFilter(f);
    fetchUsers(f, pageRequest);
  };
  const handlePageRequestChange = (p: PageRequest) => {
    setPageRequest(p);
    fetchUsers(filter, p);
  };

  return (
    <Grid container direction="row" alignItems={'center'} px={4}>
      <Grid>
        <RolesSearchFilter
          filterProducts={selectedProduct === undefined}
          filter={filter}
          onFilterChange={handleFilterChange}
        />
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" startIcon={<AddIcon />}>
          {/* TODO open addUserForm */}
          Aggiungi
        </Button>
      </Grid>
      <RolesSearchTable
        users={users}
        selectedProduct={selectedProduct}
        page={page}
        onPageRequest={handlePageRequestChange}
      />
    </Grid>
  );
}
