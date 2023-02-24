import React from 'react';
import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import ActiveProductCardContainer from './components/ActiveProductCardContainer';

type Props = {
  party: Party;
  products: Array<Product>;
};

export default function ActiveProductsSection({ party, products }: Props) {
  const { t } = useTranslation();

  const prodInteropAndProdInteropColl =
    products.find((p) => p.id === 'prod-interop-coll') &&
    products.find((p) => p.id === 'prod-interop');

  return (
    <React.Fragment>
      <TitleBox title={t('overview.activeProductsSection.title')} mbTitle={2} variantTitle="h5" />
      <Grid container spacing={3}>
        {products &&
          products
            .filter((p) =>
              prodInteropAndProdInteropColl
                ? p.productOnBoardingStatus === 'ACTIVE' && p.id !== 'prod-interop-coll'
                : p.productOnBoardingStatus === 'ACTIVE'
            )
            .sort((a, b) =>
              a.authorized === false && b.authorized !== false
                ? 1
                : a.authorized === false && b.authorized === false
                ? 0
                : -1
            )
            .map((product) => (
              <ActiveProductCardContainer
                key={product.id}
                party={party}
                product={product}
                prodInteropAndProdInteropColl={!!prodInteropAndProdInteropColl}
              />
            ))}
      </Grid>
    </React.Fragment>
  );
}
