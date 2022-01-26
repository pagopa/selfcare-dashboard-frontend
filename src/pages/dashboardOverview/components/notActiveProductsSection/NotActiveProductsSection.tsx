import React from 'react';
import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import NotActiveProductCard from './components/NotActiveProductCard';

type Props = {
  party: Party;
  products: Array<Product>;
};

export default function NotActiveProductsSection({ party, products }: Props) {
  return (
    <React.Fragment>
      <TitleBox
        title="Scopri i nuovi prodotti"
        subTitle="Attiva qui altri prodotti PagoPA, a tua disposizione in pochi passi."
        mbTitle={1}
        mtTitle={10}
        mbSubTitle={6}
        variantTitle="h2"
        variantSubTitle="body2"
      />
      <Grid container spacing={3}>
        {products &&
          products
            .filter((product) => product.status !== 'ACTIVE')
            .map((product) => (
              <NotActiveProductCard key={product.id} party={party} product={product} />
            ))}
      </Grid>
    </React.Fragment>
  );
}
