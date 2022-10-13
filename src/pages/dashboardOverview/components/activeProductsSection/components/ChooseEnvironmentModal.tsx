import SessionModal from '@pagopa/selfcare-common-frontend/components/SessionModal';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';

export default function ChooseEnvironmentModal(
  openEnvironmentModal: boolean,
  selectedParty: Party,
  selectedProduct: Product
) {
  const [openChooseEnvModal, setOpenChooseEnvModal] = useState<boolean>(openEnvironmentModal);

  const { invokeProductBo } = useTokenExchange();
  const { t } = useTranslation();

  return (
    <SessionModal
      open={openChooseEnvModal}
      title={t('overview.activeProducts.activeProductsEnvModal.title')}
      message={
        <Trans i18nKey="overview.activeProducts.activeProductsEnvModal.message">
          L’ambiente di test ti permette di conoscere
          <strong>{{ productTitle: selectedProduct.title }}</strong> e fare prove in tutta
          sicurezza. L’ambiente di produzione è il prodotto vero e proprio.
        </Trans>
      }
      onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.envProdButton')}
      onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
      onConfirm={(e) =>
        invokeProductBo(selectedProduct, selectedParty, (e.target as HTMLInputElement).value)
      }
      handleClose={() => setOpenChooseEnvModal(false)}
      productEnvironments={selectedProduct?.backOfficeEnvironmentConfigurations}
    />
  );
}
