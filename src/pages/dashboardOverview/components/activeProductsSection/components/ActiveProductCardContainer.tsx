import { Grid } from '@mui/material';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import ActiveProductCard from './ActiveProductCard';
import SessionModalInterop from './SessionModalInterop';

type Props = {
  party: Party;
  product: Product;
  prodInteropAndProdInteropColl: boolean;
  products: Array<Product>;
};

export default function ActiveProductCardContainer({
  party,
  product,
  prodInteropAndProdInteropColl,
  products,
}: Props) {
  const { t } = useTranslation();
  const { invokeProductBo } = useTokenExchange();

  const [openEnvironmentModal, setOpenEnvironmentModal] = useState<boolean>(false);

  const isDisabled = product.authorized === false;

  return (
    <>
      <Grid item xs={6} lg={4}>
        <ActiveProductCard
          disableBtn={isDisabled}
          cardTitle={product.title}
          buttonLabel={t('overview.activeProducts.manageButton')}
          urlLogo={product.logo}
          btnAction={() =>
            prodInteropAndProdInteropColl && product.id === 'prod-interop'
              ? setOpenEnvironmentModal(true)
              : invokeProductBo(product, party)
          }
          party={party}
          product={product}
        />
      </Grid>
      <SessionModalInterop
        open={openEnvironmentModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans i18nKey="overview.activeProducts.activeProductsEnvModal.message">
            Sei stato abilitato ad operare in entrambi gli ambienti. Ti ricordiamo che
            l&apos;ambiente di collaudo ti permette di conoscere
            <strong>{{ productTitle: product.title }}</strong> e fare prove in tutta sicurezza.
            L&apos;ambiente di produzione è il prodotto in esercizio.
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.envProdButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={() => invokeProductBo(product, party)}
        handleClose={() => {
          setOpenEnvironmentModal(false);
        }}
        prodInteropAndProdInteropColl={prodInteropAndProdInteropColl}
        products={products}
        party={party}
      />
    </>
  );
}
