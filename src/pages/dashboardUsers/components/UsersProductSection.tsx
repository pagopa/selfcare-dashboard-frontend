import { Grid, Typography } from '@mui/material';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useState } from 'react';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { ProductsRolesMap } from '../../../model/ProductRole';
import { ENV } from '../../../utils/env';
import { UsersTableFiltersConfig } from './UsersTableActions/UsersTableFilters';
import UsersTableProduct from './UsersTableProduct/UsersTableProduct';

type Props = {
  hideProductWhenLoading: boolean;
  party: Party;
  product: Product;
  onFetchStatusUpdate: (loading: boolean, noData: boolean) => void;
  filters: UsersTableFiltersConfig;
  productsRolesMap: ProductsRolesMap;
};

export default function UsersProductSection({
  party,
  product,
  productsRolesMap,
  hideProductWhenLoading,
  onFetchStatusUpdate,
  filters,
}: Props) {
  const [fetchStatus, setFetchStatus] = useState({ loading: true, noData: false });

  return (
    <Grid container direction="row">
      {(!hideProductWhenLoading && fetchStatus.loading) || !fetchStatus.noData ? (
        <Grid item xs={12} sx={{ mt: 7 }}>
          <Typography variant="h2">{product.title}</Typography>
        </Grid>
      ) : (
        <></>
      )}
      <Grid item xs={12}>
        <UsersTableProduct
          incrementalLoad={true}
          hideProductWhenLoading={hideProductWhenLoading}
          initialPageSize={ENV.PARTY_USERS_PAGE_SIZE}
          party={party}
          product={product}
          productRolesLists={productsRolesMap[product.id]}
          filterConfiguration={filters}
          onFetchStatusUpdate={(isFetching, count) => {
            const noData = !count || count === 0;
            setFetchStatus({ loading: isFetching, noData });
            onFetchStatusUpdate(isFetching, noData);
          }}
          userDetailUrl={resolvePathVariables('' /* TODO */, {
            institutionId: party.institutionId,
          })}
        />
      </Grid>
    </Grid>
  );
}
