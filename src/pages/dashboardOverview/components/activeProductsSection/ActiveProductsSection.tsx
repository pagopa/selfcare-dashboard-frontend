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

  const prodInterop = party.products.find((p) => p.productId === 'prod-interop');

  const prodInteropColl = party.products.find((p) => p.productId === 'prod-interop-coll');

  const prodInteropAtt = party.products.find((p) => p.productId === 'prod-interop-att');

  return (
    <React.Fragment>
      <TitleBox title={t('overview.activeProductsSection.title')} mbTitle={2} variantTitle="h5" />
      <Grid container spacing={3}>
        {party.products
          .filter((us) =>
            us.productOnBoardingStatus === 'ACTIVE' &&
            (prodInterop?.authorized ||
              prodInteropColl?.authorized === false ||
              (prodInterop?.authorized === false && !prodInteropColl))
              ? us.productId !== 'prod-interop-coll'
              : us.productOnBoardingStatus === 'ACTIVE' &&
                (prodInterop?.authorized ||
                  prodInteropAtt?.authorized === false ||
                  (prodInterop?.authorized === false && !prodInteropAtt))
              ? us.productId !== 'prod-interop-att'
              : us.productId !== 'prod-interop'
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
              key={product.productId}
              party={party}
              product={product}
              prodInteropAndProdInteropColl={
                !!(prodInterop?.authorized && prodInteropColl?.authorized)
              }
              prodInteropAndProdInteropAtt={
                !!(prodInterop?.authorized && prodInteropAtt?.authorized)
              }
              products={products}
            />
          ))}
      </Grid>
    </React.Fragment>
  );
}
