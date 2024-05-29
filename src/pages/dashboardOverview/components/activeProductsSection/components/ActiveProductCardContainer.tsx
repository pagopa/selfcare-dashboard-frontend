import { Grid } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { OnboardedProduct } from '../../../../../api/generated/b4f-dashboard/OnboardedProduct';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import ActiveProductCard from './ActiveProductCard';
import GenericEnvProductModal from './GenericEnvProductModal';
import SessionModalInteropProduct from './SessionModalInteropProduct';

type Props = {
  party: Party;
  product: OnboardedProduct;
  authorizedProdColl: boolean;
  authorizedProdAtst: boolean;
  authorizedProdInterop: boolean;
  hasMoreThanOneInteropEnv: boolean;
  products: Array<Product>;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function ActiveProductCardContainer({
  party,
  product,
  authorizedProdColl,
  authorizedProdAtst,
  authorizedProdInterop,
  hasMoreThanOneInteropEnv,
  products,
}: Props) {
  const { t } = useTranslation();
  const { invokeProductBo } = useTokenExchange();

  const [openCustomEnvInteropModal, setOpenCustomEnvInteropModal] = useState<boolean>(false);
  const [openGenericEnvProductModal, setOpenGenericEnvProductModal] = useState<boolean>(false);

  const isDisabled = !!party.products.find(
    (p) => p.productId === product.productId && p.authorized === false
  );

  const productOnboarded = products.find((p) => p.id === product.productId);

  const isOperatorWithNoProduct = party.userRole === 'LIMITED' && !product.userRole;

  return productOnboarded && !isOperatorWithNoProduct ? (
    <>
      <Grid item xs={6} lg={4}>
        <ActiveProductCard
          disableBtn={
            productOnboarded.id?.startsWith('prod-interop') && hasMoreThanOneInteropEnv
              ? false
              : isDisabled
          }
          cardTitle={productOnboarded?.title ?? ''}
          buttonLabel={t('overview.activeProducts.manageButton')}
          urlLogo={productOnboarded?.logo ?? ''}
          btnAction={() =>
            hasMoreThanOneInteropEnv && productOnboarded.id.startsWith('prod-interop')
              ? setOpenCustomEnvInteropModal(true)
              : productOnboarded?.backOfficeEnvironmentConfigurations &&
                productOnboarded.id !== 'prod-interop'
              ? setOpenGenericEnvProductModal(true)
              : invokeProductBo(productOnboarded, party)
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
            values={{ productTitle: productOnboarded.title }}
            components={{ 1: <strong /> }}
          >
            {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={() => invokeProductBo(productOnboarded, party)}
        handleClose={() => {
          setOpenCustomEnvInteropModal(false);
        }}
        authorizedProdColl={authorizedProdColl}
        authorizedProdAtst={authorizedProdAtst}
        authorizedProdInterop={authorizedProdInterop}
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
          invokeProductBo(productOnboarded, party, (e.target as HTMLInputElement).value)
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
