import { Grid } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { OnboardedProduct } from '../../../../../api/generated/b4f-dashboard/OnboardedProduct';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { INTEROP_PRODUCT_ENUM } from '../../../../../utils/constants';
import { startWithProductInterop } from '../../../../../utils/helperFunctions';
import ActiveProductCard from './ActiveProductCard';
import GenericEnvProductModal from './GenericEnvProductModal';
import SessionModalInteropProduct from './SessionModalInteropProduct';

type Props = {
  party: Party;
  product: OnboardedProduct;
  hasMoreThanOneInteropEnv: boolean;
  products: Array<Product>;
  authorizedInteropProducts: Array<string>;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function ActiveProductCardContainer({
  party,
  product,
  hasMoreThanOneInteropEnv,
  products,
  authorizedInteropProducts,
}: Props) {
  const { t } = useTranslation();
  const { invokeProductBo } = useTokenExchange();
  const { hasPermission } = usePermissions();

  const [openCustomEnvInteropModal, setOpenCustomEnvInteropModal] = useState<boolean>(false);
  const [openGenericEnvProductModal, setOpenGenericEnvProductModal] = useState<boolean>(false);

  const isDisabled = !!party.products.find(
    (p) =>
      p.productId === product.productId &&
      hasPermission(p.productId ?? '', Actions.AccessProductBackoffice) === false
  );

  const productOnboarded = products.find((p) => p.id === product.productId);
  const interopProduction = products.find((p) => p.id === INTEROP_PRODUCT_ENUM.INTEROP);

  const isOperatorWithNoAuthorizedProduct = party.userRole === 'LIMITED' && isDisabled;

  const lang = i18n.language;

  return productOnboarded && !isOperatorWithNoAuthorizedProduct ? (
    <>
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <ActiveProductCard
          disableBtn={
            startWithProductInterop(productOnboarded.id) && hasMoreThanOneInteropEnv
              ? false
              : isDisabled
          }
          cardTitle={
            startWithProductInterop(productOnboarded?.id)
              ? products.find((p) => p.id === INTEROP_PRODUCT_ENUM.INTEROP)?.title ?? ''
              : productOnboarded?.title ?? ''
          }
          buttonLabel={t('overview.activeProducts.manageButton')}
          urlLogo={productOnboarded?.logo ?? ''}
          btnAction={() =>
            hasMoreThanOneInteropEnv && startWithProductInterop(productOnboarded.id)
              ? setOpenCustomEnvInteropModal(true)
              : productOnboarded?.backOfficeEnvironmentConfigurations &&
                productOnboarded.id !== INTEROP_PRODUCT_ENUM.INTEROP
              ? setOpenGenericEnvProductModal(true)
              : invokeProductBo(productOnboarded, party, undefined, lang)
          }
          party={party}
          product={productOnboarded}
        />
      </Grid>
      <SessionModalInteropProduct
        open={openCustomEnvInteropModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.message"
            values={{
              productTitle: startWithProductInterop(productOnboarded.id)
                ? products?.find((pp) => pp.id === 'prod-interop')?.title
                : productOnboarded.title,
            }}
            components={{ 1: <strong /> }}
          >
            {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={() => invokeProductBo(interopProduction as Product, party, undefined, lang)}
        handleClose={() => {
          setOpenCustomEnvInteropModal(false);
        }}
        authorizedInteropProducts={authorizedInteropProducts}
        products={products}
        party={party}
      />

      <GenericEnvProductModal
        open={openGenericEnvProductModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.message"
            values={{ productTitle: productOnboarded.title }}
            components={{ 1: <strong /> }}
          >
            {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={(e) =>
          invokeProductBo(productOnboarded, party, (e.target as HTMLInputElement).value, lang)
        }
        handleClose={() => {
          setOpenGenericEnvProductModal(false);
        }}
        productEnvironments={productOnboarded?.backOfficeEnvironmentConfigurations as any}
      />
    </>
  ) : (
    <></>
  );
}
