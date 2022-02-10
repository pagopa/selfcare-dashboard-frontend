import { Grid, Typography } from '@mui/material';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useState } from 'react';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { UsersTableFiltersConfig } from './UsersTableActions/UsersTableFilters';
import UsersTableProduct from './UsersTableProduct/UsersTableProduct';

type Props = {
  party: Party;
  product: Product;
  onFetchStatusUpdate: (loading: boolean, noData: boolean) => void;
  filters: UsersTableFiltersConfig;
};

export default function UsersProductSection({
  party,
  product,
  onFetchStatusUpdate,
  filters,
}: Props) {
  const [fetchStatus, setFetchStatus] = useState({ loading: true, noData: false });

  return (
    <Grid container direction="row">
      {fetchStatus.loading || !fetchStatus.noData ? (
        <Grid item xs={12} sx={{ mt: 7 }}>
          <Typography variant="h2">{product.title}</Typography>
        </Grid>
      ) : (
        <></>
      )}
      <Grid item xs={12}>
        <UsersTableProduct
          party={party}
          product={product}
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
