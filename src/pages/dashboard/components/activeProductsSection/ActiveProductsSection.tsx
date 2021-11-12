import React from 'react';
import { Grid } from '@mui/material';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import ActiveProductCard from './components/ActiveProductCard';
import TitleBox from './../TitleBox';

export default function ActiveProductsSection() {
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const buttonLabel = 'Gestisci il prodotto';
  const infoLabel = 'Ultimo servizio attivato: 24 Ottobre 2021';

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
