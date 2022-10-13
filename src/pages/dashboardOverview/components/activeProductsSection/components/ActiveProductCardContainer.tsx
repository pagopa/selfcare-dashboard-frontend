import { Grid, Typography } from '@mui/material';
import SessionModal from '@pagopa/selfcare-common-frontend/components/SessionModal';
import { formatDateAsLongString } from '@pagopa/selfcare-common-frontend/utils/utils';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import ActiveProductCard from './ActiveProductCard';

type Props = {
  party: Party;
  product: Product;
};

export default function ActiveProductCardContainer({ party, product }: Props) {
  const { t } = useTranslation();
  const { invokeProductBo } = useTokenExchange();
  const [openChooseEnvModal, setOpenChooseEnvModal] = useState<boolean>(false);
  const isDisabled = product.authorized === false;
  const lastServiceActivationDate = undefined; // actually this info is not available

  return (
    <Grid item xs={6} lg={4} xl={3}>
      <ActiveProductCard
        disableBtn={isDisabled}
        cardTitle={product.title}
        buttonLabel={t('overview.activeProducts.manageButton')}
        urlLogo={product.logo}
        btnAction={() =>
          product.backOfficeEnvironmentConfigurations
            ? setOpenChooseEnvModal(true)
            : invokeProductBo(product, party)
        }
        party={party}
        product={product}
      />
      {lastServiceActivationDate && (
        <Typography variant="h5" sx={{ fontSize: '16px' }} mx={1}>
          {t('overview.lastServiceActive') +
            `${lastServiceActivationDate && formatDateAsLongString(lastServiceActivationDate)}`}
        </Typography>
      )}
      <SessionModal
        open={openChooseEnvModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans i18nKey="overview.activeProducts.activeProductsEnvModal.message">
            L&apos;ambiente di test ti permette di conoscere
            <strong>{{ productTitle: product.title }}</strong> e fare prove in tutta sicurezza.
            L&apos;ambiente di Produzione è il prodotto in esercizio effettivo.
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.envProdButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={(e) => invokeProductBo(product, party, (e.target as HTMLInputElement).value)}
        handleClose={() => setOpenChooseEnvModal(false)}
        productEnvironments={product?.backOfficeEnvironmentConfigurations}
      />
    </Grid>
  );
}
