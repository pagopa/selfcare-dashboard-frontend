import { Grid } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import TitleBox from '@pagopa/selfcare-common-frontend/lib/components/TitleBox';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
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
  const { hasPermission } = usePermissions();

  const findAuthorizedProduct = (productId: string) =>
    party.products.find(
      (p) =>
        p.productId === productId && hasPermission(p.productId, Actions.AccessProductBackoffice)
    );

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
              us.productOnBoardingStatus === 'ACTIVE' && handleInteropEnviroments(us?.productId)
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
