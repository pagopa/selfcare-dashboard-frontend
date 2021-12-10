import { Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useHistory } from 'react-router-dom';
import { Product } from '../../../../model/Product';
import { Page } from '../../../../model/Page';
import { PageRequest } from '../../../../model/PageRequest';
import { PartyUser } from '../../../../model/PartyUser';
import { DASHBOARD_ROUTES, resolvePathVariables } from '../../../../routes';
import { Party } from '../../../../model/Party';
import { fetchPartyUsers } from '../../../../services/usersService';
import { useAppDispatch } from '../../../../redux/hooks';
import { AppError, appStateActions } from '../../../../redux/slices/appStateSlice';
import useLoading from '../../../../hooks/useLoading';
import { LOADING_TASK_PARTY_USERS } from '../../../../utils/constants';
import UsersSearchFilter, { UsersSearchFilterConfig } from './components/UsersSearchFilter';
import UsersSearchTable from './components/UsersSearchTable';

interface UsersSearchProps {
  party: Party;
  selectedProduct?: Product;
  products: Array<Product>;
}

const pageSize: number = Number.parseInt(process.env.REACT_APP_PARTY_USERS_PAGE_SIZE, 10);

export default function UsersSearch({ party, selectedProduct, products }: UsersSearchProps) {
  const [users, setUsers] = useState<Array<PartyUser>>([]);
  const [page, setPage] = useState<Page>({
    number: 0,
    size: pageSize,
    totalElements: 0,
    totalPages: 0,
  });
  const [filter, setFilter] = useState<UsersSearchFilterConfig>(
    selectedProduct ? { product: selectedProduct } : {}
  );
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 0,
    size: pageSize,
  });
  const history = useHistory();
  const dispatch = useAppDispatch();
  const setLoading = useLoading(LOADING_TASK_PARTY_USERS);

  const addError = (error: AppError) => dispatch(appStateActions.addError(error));

  const fetchUsers = (f: UsersSearchFilterConfig, pageRequest: PageRequest) => {
    setLoading(true);
    fetchPartyUsers(pageRequest, party.institutionId, f.product, f.role)
      .then((r) => {
        setUsers(r.content);
        setPage(r.page);
      })
      .catch((reason) =>
        addError({
          id: 'FETCH_USER_ROLE',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while fetching party users ${party.institutionId} and filter ${f}`,
          onRetry: () => fetchUsers(f, pageRequest),
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(filter, pageRequest);
  }, []);

  const handleFilterChange = (f: UsersSearchFilterConfig) => {
    setFilter(f);
    fetchUsers(f, pageRequest);
  };
  const handlePageRequestChange = (p: PageRequest) => {
    setPageRequest(p);
    fetchUsers(filter, p);
  };

  return (
    <Grid container direction="row" alignItems={'center'}>
      <Grid item xs={12}>
        <Grid container direction="row" justifyContent={'flex-end'} alignItems={'center'} px={2}>
          <Grid item>
            <UsersSearchFilter
              filterProducts={selectedProduct === undefined}
              filter={filter}
              onFilterChange={handleFilterChange}
              products={products}
            />
          </Grid>
          {selectedProduct && (
            <Grid item pl={4}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ py: '10px' }}
                onClick={() =>
                  history.push(
                    resolvePathVariables(
                      DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.subRoutes.ADD_PARTY_PRODUCT_USER.path,
                      { institutionId: party.institutionId, productId: selectedProduct.id }
                    )
                  )
                }
              >
                Aggiungi
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} my={8}>
        <Box>
          <UsersSearchTable
            users={users}
            selectedProduct={selectedProduct}
            page={page}
            sort={pageRequest.sort}
            onPageRequest={handlePageRequestChange}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
