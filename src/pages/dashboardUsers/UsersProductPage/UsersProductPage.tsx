import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useEffect } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Product } from '../../../model/Product';
import ProductNavigationBar from '../../../components/ProductNavigationBar';
import { Party } from '../../../model/Party';
import UsersTableProduct from '../components/UsersTableProduct/UsersTableProduct';

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

export default function UsersProductPage({ party, selectedProduct }: Props) {
  useEffect(
    () => trackEvent('USER_LIST', { party_id: party.institutionId, product: selectedProduct.id }),
    [selectedProduct]
  );
  return (
    <Grid
      container
      alignItems={'center'}
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
      <Grid item xs={12}>
        <UsersTableProduct
          party={party}
          product={selectedProduct}
          filterConfiguration={{ productIds: [], selcRole: [], productRoles: [] }}
          onFetchStatusUpdate={() => {} /* TODO */}
          onRowClick={() => {} /* TODO */}
        />
      </Grid>
    </Grid>
  );
}
