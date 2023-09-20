/* eslint-disable sonarjs/no-identical-functions */
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

  const prodInterop = party.products.find((p) => p.productId === 'prod-interop' && p.authorized);

  const haveProdInteropAndEnvProduct =
    prodInterop && party.products.find((p) => p.productId === 'prod-interop-coll' && p.authorized);

  return (
    <React.Fragment>
      <TitleBox title={t('overview.activeProductsSection.title')} mbTitle={2} variantTitle="h5" />
      <Grid container spacing={3}>
        {party.products
          .filter(
            (us) =>
              us.productOnBoardingStatus === 'ACTIVE' &&
              ((us.productId === 'prod-interop-coll' && us.authorized === true && !prodInterop) ||
                (!prodInterop && us.productId !== 'prod-interop-coll') ||
                (prodInterop && us.productId !== 'prod-interop-coll'))
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
              haveProdInteropAndEnvProduct={!!haveProdInteropAndEnvProduct}
              products={products}
            />
          ))}
      </Grid>
    </React.Fragment>
  );
}
