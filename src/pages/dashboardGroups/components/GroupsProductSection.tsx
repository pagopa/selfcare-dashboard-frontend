import { Grid, Typography } from '@mui/material';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { useState } from 'react';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { ENV } from '../../../utils/env';
import GroupsTableProduct from './GroupsTableProduct/GroupsTableProduct';

type Props = {
  party: Party;
  product: Product;
  currentUser: User;
  onFetchStatusUpdate: (loading: boolean, noData: boolean) => void;
};

export default function GroupsProductSection({
  party,
  product,
  currentUser,
  onFetchStatusUpdate,
}: Props) {
  const [fetchStatus, setFetchStatus] = useState({ loading: true, noData: false });

  return (
    <Grid container direction="row">
      {fetchStatus.loading || !fetchStatus.noData ? (
        <Grid item xs={12} sx={{ mt: 7 }}>
          <Typography variant="h2" id={product.id}>
            {product.title}
          </Typography>
        </Grid>
      ) : (
        <></>
      )}

      <Grid item xs={12}>
        <GroupsTableProduct
          incrementalLoad={true}
          initialPageSize={ENV.PARTY_GROUPS_PAGE_SIZE}
          party={party}
          product={product}
          onCompleteDelete={() => {
            setFetchStatus({ loading: false, noData: true });
            onFetchStatusUpdate(false, true);
          }}
          currentUser={currentUser}
          onFetchStatusUpdate={(isFetching, count) => {
            const noData = !count || count === 0;
            setFetchStatus({ loading: isFetching, noData });
            onFetchStatusUpdate(isFetching, noData);
          }}
        />
      </Grid>
    </Grid>
  );
}
