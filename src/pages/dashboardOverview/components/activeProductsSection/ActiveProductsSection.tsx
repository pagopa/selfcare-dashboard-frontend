import { Grid } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { Actions } from '@pagopa/selfcare-common-frontend/utils/constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { startWithProductInterop } from '../../../../utils/helperFunctions';
import ActiveProductCardContainer from './components/ActiveProductCardContainer';

type Props = {
  party: Party;
  products: Array<Product>;
};

export default function ActiveProductsSection({ party, products }: Readonly<Props>) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const interopProducts = party?.products
    .filter(
      (product) =>
        startWithProductInterop(product.productId) && product.productOnBoardingStatus === 'ACTIVE'
    )
    .map((p) => p.productId ?? '');

  const authorizedInteropProducts = party?.products
    .filter(
      (product) =>
        startWithProductInterop(product.productId) &&
        hasPermission(product.productId ?? '', Actions.AccessProductBackoffice)
    )
    .map((p) => p.productId ?? '');

  const hasMoreThanOneInteropEnv = authorizedInteropProducts.length > 1;

  const isRelevantInteropProduct = (productId: string) => {
    if (startWithProductInterop(productId)) {
      if (authorizedInteropProducts.length > 0) {
        return productId === authorizedInteropProducts[0];
      }
      if (interopProducts.length > 0) {
        return productId === interopProducts[0];
      }
    }
    return true;
  };

  return (
    <React.Fragment>
      <TitleBox
        title={t('overview.activeProductsSection.title')}
        mbTitle={2}
        variantTitle="h5"
        titleFontSize="22px"
      />
      <Grid container spacing={3}>
        {party.products
          .filter(
            (us) =>
              us.productOnBoardingStatus === 'ACTIVE' &&
              isRelevantInteropProduct(us.productId ?? '')
          )
          .sort((a, b) => {
            const aHasPermission = hasPermission(
              a.productId ?? '',
              Actions.AccessProductBackoffice
            );
            const bHasPermission = hasPermission(
              b.productId ?? '',
              Actions.AccessProductBackoffice
            );

            if (aHasPermission === bHasPermission) {
              return 0;
            }
            return aHasPermission ? -1 : 1; // Move products without permission to the end
          })
          .map((product) => (
            <ActiveProductCardContainer
              key={product.productId}
              party={party}
              product={product}
              hasMoreThanOneInteropEnv={hasMoreThanOneInteropEnv}
              authorizedInteropProducts={authorizedInteropProducts}
              products={products}
            />
          ))}
      </Grid>
    </React.Fragment>
  );
}
