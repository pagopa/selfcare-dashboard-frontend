import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import ActiveProductCardContainer from './components/ActiveProductCardContainer';

type Props = {
  party: Party;
  products: Array<Product>;
};

export default function ActiveProductsSection({ party, products }: Props) {
  const { t } = useTranslation();

  const prodInterop = party.products.find((p) => p.productId === 'prod-interop');

  const prodInteropColl = party.products.find((p) => p.productId === 'prod-interop-coll');

  const prodInteropAtst = party.products.find((p) => p.productId === 'prod-interop-atst');

  return (
    <React.Fragment>
      <TitleBox title={t('overview.activeProductsSection.title')} mbTitle={2} variantTitle="h5" />
      <Grid container spacing={3}>
        {party.products
          .filter(
            (us) =>
              us.productOnBoardingStatus === 'ACTIVE' &&
              (prodInterop?.authorized
                ? us.productId !== 'prod-interop-coll' && us.productId !== 'prod-interop-atst'
                : us.productId !== 'prod-interop')
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
              prodInteropAndProdInteropAtst={
                !!(prodInterop?.authorized && prodInteropAtst?.authorized)
              }
              products={products}
            />
          ))}
      </Grid>
    </React.Fragment>
  );
}
