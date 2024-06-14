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

  const findAuthorizedProduct = (productId: string) =>
    party.products.find((p) => p.productId === productId && p.authorized);

  const authorizedProdInterop = findAuthorizedProduct('prod-interop');
  const authorizedProdAtst = findAuthorizedProduct('prod-interop-atst');
  const authorizedProdColl = findAuthorizedProduct('prod-interop-coll');

  const authorizedInteropProducts = [
    authorizedProdInterop,
    authorizedProdAtst,
    authorizedProdColl,
  ].filter((product) => product);

  const hasMoreThanOneInteropEnv = authorizedInteropProducts.length > 1;

  const handleInteropEnviroments = (productId?: string) =>
    (hasMoreThanOneInteropEnv
      ? productId !== 'prod-interop-coll' && productId !== 'prod-interop-atst'
      : true) &&
    (!authorizedProdColl ? productId !== 'prod-interop-coll' : true) &&
    (!authorizedProdAtst ? productId !== 'prod-interop-atst' : true) &&
    (authorizedInteropProducts.length === 0
      ? true
      : !authorizedProdInterop && !hasMoreThanOneInteropEnv
      ? productId !== 'prod-interop'
      : true);

  return (
    <React.Fragment>
      <TitleBox title={t('overview.activeProductsSection.title')} mbTitle={2} variantTitle="h5" titleFontSize='22px'/>
      <Grid container spacing={3}>
        {party.products
          .filter(
            (us) =>
              us.productOnBoardingStatus === 'ACTIVE' && handleInteropEnviroments(us?.productId)
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
