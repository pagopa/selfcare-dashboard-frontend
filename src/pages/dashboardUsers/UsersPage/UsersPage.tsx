import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useEffect } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Product } from '../../../model/Product';
import { Party } from '../../../model/Party';
import UsersSearch from '../components/usersSearch/UsersSearch';

interface Props {
  party: Party;
  products: Array<Product>;
}

export default function UsersPage({ party, products }: Props) {
  useEffect(() => trackEvent('USER_LIST', { party_id: party.institutionId }), []);
  return (
    <Grid
      container
      alignItems={'center'}
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
      <Grid item xs={12}>
        <UsersSearch party={party} products={products} />
      </Grid>
    </Grid>
  );
}
