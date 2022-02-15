import { Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useHistory } from 'react-router-dom';
import { Page } from '@pagopa/selfcare-common-frontend/model/Page';
import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Product } from '../../../../model/Product';
import { PartyUser } from '../../../../model/PartyUser';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { Party } from '../../../../model/Party';
import { fetchPartyUsers } from '../../../../services/usersService';
import { useAppSelector } from '../../../../redux/hooks';
import { LOADING_TASK_PARTY_USERS } from '../../../../utils/constants';
import { ENV } from '../../../../utils/env';
import UsersSearchFilter, { UsersSearchFilterConfig } from './components/UsersSearchFilter';
import UsersSearchTable from './components/UsersSearchTable';

interface UsersSearchProps {
  party: Party;
  selectedProduct?: Product;
  products: Array<Product>;
}

export default function UsersSearch({ party, selectedProduct, products }: UsersSearchProps) {
  const currentUser = useAppSelector(userSelectors.selectLoggedUser);
  const selectedProductId = selectedProduct?.id;
  const [users, setUsers] = useState<Array<PartyUser> | null>(null);
  const [page, setPage] = useState<Page>({
    number: 0,
    size: ENV.PARTY_USERS_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
  });
  const [filter, setFilter] = useState<UsersSearchFilterConfig>({});
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 0,
    size: ENV.PARTY_USERS_PAGE_SIZE,
  });
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_PARTY_USERS);

  const addError = useErrorDispatcher();

  const fetchUsers = (f: UsersSearchFilterConfig, pageRequest: PageRequest) => {
    setLoading(true);
    fetchPartyUsers(
      pageRequest,
      party,
      currentUser ?? ({ uid: 'NONE' } as User),
      !!selectedProduct,
      f.product,
      f.role
    )
      .then((r) => {
        setUsers(r.content);
        setPage(r.page);
      })
      .catch((reason) => {
        addError({
          id: 'FETCH_PARTY_USERS',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while fetching party users ${party.institutionId} and filter ${f}`,
          onRetry: () => fetchUsers(f, pageRequest),
          toNotify: true,
        });
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    trackEvent('USER_LIST', { party_id: party.institutionId, product: selectedProductId });
    const newFilter = {
      ...filter,
      product: selectedProduct,
    };
    setFilter(newFilter);
    fetchUsers(newFilter, pageRequest);
  }, [selectedProductId]);

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
        {!selectedProduct && (
          <Grid item pl={4}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ py: '10px' }}
              onClick={() =>
                history.push(
                  resolvePathVariables(
                    DASHBOARD_ROUTES.PARTY_USERS.subRoutes.ADD_PRODUCT_USER.path,
                    { institutionId: party.institutionId }
                  )
                )
              }
            >
              Aggiungi
            </Button>

            <Button
              variant="contained"
              sx={{ py: '10px' }}
              onClick={() =>
                history.push(
                  resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.subRoutes.EDIT_USER.path, {
                    institutionId: party.institutionId,
                  })
                )
              }
            >
              Modifica
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} my={8}>
        <Box>
          {users != null && (
            <UsersSearchTable
              party={party}
              selectedProduct={selectedProduct}
              users={users}
              page={page}
              sort={pageRequest.sort}
              onPageRequest={handlePageRequestChange}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
