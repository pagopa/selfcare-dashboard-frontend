import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Product } from '../../../model/Product';
import ProductNavigationBar from '../../../components/ProductNavigationBar';
import { Party } from '../../../model/Party';
import UsersTableProduct from '../components/UsersTableProduct/UsersTableProduct';
import UsersTableActions from '../components/UsersTableActions/UsersTableActions';
import { UsersTableFiltersConfig } from '../components/UsersTableActions/UsersTableFilters';
import { DASHBOARD_ROUTES } from '../../../routes';
import UserTableNoData from '../components/UserTableNoData';
import { ENV } from '../../../utils/env';

interface Props {
  party: Party;
  selectedProduct: Product;
  products: Array<Product>;
}

const paths = [
  {
    description: 'Referenti',
  },
];

const emptyFilters: UsersTableFiltersConfig = {
  productIds: [],
  selcRole: [],
  productRoles: [],
};

export default function UsersProductPage({ party, products, selectedProduct }: Props) {
  const [filters, setFilters] = useState<UsersTableFiltersConfig>(emptyFilters);
  const [fetchStatus, setFetchStatus] = useState({ loading: true, noData: false });

  useEffect(
    () => trackEvent('USER_LIST', { party_id: party.institutionId, product: selectedProduct.id }),
    [selectedProduct]
  );

  return (
    <Grid
      container
      px={0}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3} px={'16px'}>
        <ProductNavigationBar selectedProduct={selectedProduct} paths={paths} />
      </Grid>
      <Grid item xs={12} mb={9} px={'16px'}>
        <TitleBox
          title="Referenti"
          subTitle={`Gestisci i Referenti Amministrativi e Operativi abilitati alla gestione del prodotto ${selectedProduct.title}.`}
        />
      </Grid>
      {/* TODO continue building the page */}
      <Grid container direction="row" alignItems={'center'}>
        <Grid item xs={12}>
          <UsersTableActions
            disableFilters={fetchStatus.loading}
            loading={fetchStatus.loading}
            party={party}
            products={products}
            selectedProduct={selectedProduct}
            filters={filters}
            onFiltersChange={setFilters}
            addUserUrl={resolvePathVariables(
              DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.subRoutes.ADD_PARTY_PRODUCT_USER.path,
              { institutionId: party.institutionId, productId: selectedProduct.id }
            )}
          />
        </Grid>
        <Grid item xs={12} mt={6}>
          <UsersTableProduct
            hideProductWhenLoading={true}
            incrementalLoad={false}
            initialPageSize={ENV.PARTY_PRODUCT_USERS_PAGE_SIZE}
            party={party}
            product={selectedProduct}
            filterConfiguration={filters}
            onFetchStatusUpdate={(isFetching, count) => {
              setFetchStatus({ loading: isFetching, noData: !count || count === 0 });
            }}
            userDetailUrl={resolvePathVariables('' /* TODO */, {
              institutionId: party.institutionId,
              productId: selectedProduct.id,
            })}
          />
        </Grid>
        {!fetchStatus.loading && fetchStatus.noData && (
          <UserTableNoData removeFilters={() => setFilters(emptyFilters)} />
        )}
      </Grid>
    </Grid>
  );
}
