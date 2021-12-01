import React from 'react';
import { Grid } from '@mui/material';
import { Product } from '../../../../model/Product';
import TitleBox from '../../../../components/TitleBox';
import NotActiveProductCard from './components/NotActiveProductCard';

type Props = {
  products: Array<Product>;
};

export default function NotActiveProductsSection({ products }: Props) {
  const buttonLabel = 'Aderisci al prodotto';
  const infoLabel = 'SCOPRI DI PIÙ →';

  return (
    <React.Fragment>
      <TitleBox
        title="Scopri i nuovi prodotti"
        subTitle="Attiva qui altri prodotti PagoPA, a tua disposizione in pochi passi."
        mbTitle={1}
        mtGrid={10}
        mbSubTitle={6}
        variantTitle="h2"
        variantSubTitle="body2"
      />
      <Grid container spacing={3}>
        {products &&
          products.findIndex((product) => product.active === false) > -1 &&
          products
            .filter((product) => product.active === false)
            .map((product) => (
              <NotActiveProductCard
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
