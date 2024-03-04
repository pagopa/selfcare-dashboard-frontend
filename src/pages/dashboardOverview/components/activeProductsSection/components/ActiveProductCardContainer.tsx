import { Grid } from '@mui/material';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { SessionModal } from '@pagopa/selfcare-common-frontend';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { OnboardedProduct } from '../../../../../api/generated/b4f-dashboard/OnboardedProduct';
import ActiveProductCard from './ActiveProductCard';
import SessionModalInteropProduct from './SessionModalInteropProduct';

type Props = {
  party: Party;
  product: OnboardedProduct;
  prodInteropAndProdInteropColl: boolean;
  prodInteropAndProdInteropAtt: boolean;
  products: Array<Product>;
};

export default function ActiveProductCardContainer({
  party,
  product,
  prodInteropAndProdInteropColl,
  prodInteropAndProdInteropAtt,
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

  return productOnboarded ? (
    <>
      <Grid item xs={6} lg={4}>
        <ActiveProductCard
          disableBtn={isDisabled}
          cardTitle={productOnboarded?.title ?? ''}
          buttonLabel={t('overview.activeProducts.manageButton')}
          urlLogo={productOnboarded?.logo ?? ''}
          btnAction={() =>
            (prodInteropAndProdInteropColl && productOnboarded.id === 'prod-interop') ||
            (prodInteropAndProdInteropAtt && productOnboarded.id === 'prod-interop')
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
        prodInteropAndProdInteropColl={prodInteropAndProdInteropColl}
        prodInteropAndProdInteropAtt={prodInteropAndProdInteropAtt}
        products={products}
        party={party}
      />

      <SessionModal
        open={openGenericEnvProductModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.messageProduct"
            values={{ productTitle: productOnboarded.title }}
            components={{ 1: <strong /> }}
          >
            {`L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di Produzione è il prodotto in esercizio effettivo.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.envProdButton')}
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
