import React from 'react';
import { Grid } from '@mui/material';
import { Product } from '../../../../model/Product';
import ActiveProductCard from './components/ActiveProductCard';
import TitleBox from './../TitleBox';

type Props = {
  products: Array<Product>;
};

export default function ActiveProductsSection({ products }: Props) {
  const buttonLabel = 'Gestisci il prodotto';
  const infoLabel: Date = new Date('10-24-2021'); // TODO: where to find this info?

  return (
    <React.Fragment>
      <TitleBox
        title="Prodotti attivi"
        subTitle="I prodotti PagoPA a cui il tuo Ente ha aderito."
        mbTitle={1}
        mtGrid={10}
        mbSubTitle={5}
        variantTitle="h2"
        variantSubTitle="body2"
      />
      <Grid container spacing={4}>
        {products &&
          products
            .filter((p) => p.active)
            .map((product) => (
              <ActiveProductCard
                key={product.id}
                product={product}
                buttonLabel={buttonLabel}
                infoLabel={infoLabel}
              />
            ))}
      </Grid>
    </React.Fragment>
  );
}
