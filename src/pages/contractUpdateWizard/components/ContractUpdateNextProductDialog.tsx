import { useTranslation } from 'react-i18next';
import { ContractUpdateConfirmDialog } from './ContractUpdateConfirmDialog';

type Props = {
  open: boolean;
  productName: string;
  onClose: () => void;
  onBackToDocuments: () => void;
  onContinue: () => void;
};

export const ContractUpdateNextProductDialog = ({
  open,
  productName,
  onClose,
  onBackToDocuments,
  onContinue,
}: Props) => {
  const { t } = useTranslation();

  return (
    <ContractUpdateConfirmDialog
      id="contract-update-next-product"
      open={open}
      title={t('contractUpdateWizard.nextProductModal.title', { productName })}
      message={t('contractUpdateWizard.nextProductModal.message')}
      closeLabel={t('contractUpdateWizard.nextProductModal.close')}
      onClose={onClose}
      secondaryAction={{
        label: t('contractUpdateWizard.nextProductModal.back'),
        onClick: onBackToDocuments,
      }}
      primaryAction={{
        label: t('contractUpdateWizard.nextProductModal.confirm'),
        onClick: onContinue,
      }}
    />
  );
};
