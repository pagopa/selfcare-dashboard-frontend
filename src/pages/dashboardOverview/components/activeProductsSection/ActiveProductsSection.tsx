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

  const authorizedProdInterop = party.products.find(
    (p) => p.productId === 'prod-interop' && p.authorized === true
  );

  const authorizedProdAtst = party.products.find(
    (p) => p.productId === 'prod-interop-atst' && p.authorized === true
  );

  const authorizedProdColl = party.products.find(
    (p) => p.productId === 'prod-interop-coll' && p.authorized === true
  );

  const authorizedInteropProducts = [
    authorizedProdInterop,
    authorizedProdAtst,
    authorizedProdColl,
  ].filter((product) => product);

  const hasMoreThanOneInteropEnv = authorizedInteropProducts.length > 1;

  return (
    <React.Fragment>
      <TitleBox title={t('overview.activeProductsSection.title')} mbTitle={2} variantTitle="h5" />
      <Grid container spacing={3}>
        {party.products
          .filter(
            (us) =>
              us.productOnBoardingStatus === 'ACTIVE' &&
              (hasMoreThanOneInteropEnv
                ? us.productId !== 'prod-interop-coll' && us.productId !== 'prod-interop-atst'
                : true) &&
              (!authorizedProdColl ? us.productId !== 'prod-interop-coll' : true) &&
              (!authorizedProdAtst ? us.productId !== 'prod-interop-atst' : true) &&
              (authorizedInteropProducts.length === 0
                ? true
                : !authorizedProdInterop && !hasMoreThanOneInteropEnv
                ? us.productId !== 'prod-interop'
                : true)
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
              authorizedProdColl={!!authorizedProdColl}
              authorizedProdAtst={!!authorizedProdAtst}
              authorizedProdInterop={!!authorizedProdInterop}
              hasMoreThanOneInteropEnv={hasMoreThanOneInteropEnv}
              products={products}
            />
          ))}
      </Grid>
    </React.Fragment>
  );
}
