import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Product } from '../../../model/Product';
import { Party } from '../../../model/Party';
import UsersTableActions from '../components/UsersTableActions/UsersTableActions';
import { DASHBOARD_ROUTES } from '../../../routes';
import UsersProductSection from '../components/UsersProductSection';
import { UsersTableFiltersConfig } from '../components/UsersTableActions/UsersTableFilters';
import UserTableNoData from '../components/UserTableNoData';

interface Props {
  party: Party;
  products: Array<Product>;
}

const emptyFilters: UsersTableFiltersConfig = {
  productIds: [],
  selcRole: [],
  productRoles: [],
};

export default function UsersPage({ party, products }: Props) {
  const [filters, setFilters] = useState<UsersTableFiltersConfig>(emptyFilters);
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(true);

  const [productsFetchStatus, setProductsFetchStatus] = useState<
    Record<string, { loading: boolean; noData: boolean }>
  >(() => Object.fromEntries(products.map((p) => [[p.id], { loading: true, noData: false }])));

  useEffect(() => {
    if (productsFetchStatus) {
      setLoading(!!Object.values(productsFetchStatus).find((p) => p.loading));
      setNoData(!!Object.values(productsFetchStatus).find((p) => p.noData));
    }
  }, [productsFetchStatus]);

  useEffect(() => trackEvent('USER_LIST', { party_id: party.institutionId }), []);

  return (
    <Grid
      container
      px={0}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={9} px={'16px'}>
        <TitleBox
          title="Referenti"
          subTitle="Visualizza e gestisci i referenti abilitati alla gestione dei prodotti del tuo Ente."
        />
      </Grid>
      {/* TODO continue building the page */}
      <Grid container direction="row" alignItems={'center'}>
        <Grid item xs={12}>
          <UsersTableActions
            disableFilters={loading}
            loading={loading}
            party={party}
            products={products}
            filters={filters}
            onFiltersChange={setFilters}
            addUserUrl={resolvePathVariables(
              DASHBOARD_ROUTES.PARTY_USERS.subRoutes.ADD_PARTY_USER.path,
              { institutionId: party.institutionId }
            )}
          />
        </Grid>
        {products.map((p) => (
          <Grid key={p.id} item xs={12}>
            <UsersProductSection
              hideProductWhenLoading={true}
              party={party}
              product={p}
              filters={filters}
              onFetchStatusUpdate={(loading, noData) => {
                setProductsFetchStatus((previousState) => ({
                  ...previousState,
                  [p.id]: { loading, noData },
                }));
              }}
            />
          </Grid>
        ))}
        {!loading && noData && <UserTableNoData removeFilters={() => setFilters(emptyFilters)} />}
      </Grid>
    </Grid>
  );
}
