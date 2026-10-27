import { useTranslation } from 'react-i18next';
import { ContractUpdateConfirmDialog } from './ContractUpdateConfirmDialog';

type Props = {
  open: boolean;
  onStay: () => void;
  onExit: () => void;
};

export const ContractUpdateExitDialog = ({ open, onStay, onExit }: Props) => {
  const { t } = useTranslation();

  return (
    <ContractUpdateConfirmDialog
      id="contract-update-exit"
      open={open}
      title={t('contractUpdateWizard.exitModal.title')}
      message={t('contractUpdateWizard.exitModal.message')}
      closeLabel={t('contractUpdateWizard.exitModal.close')}
      onClose={onStay}
      secondaryAction={{ label: t('contractUpdateWizard.exitModal.back'), onClick: onStay }}
      primaryAction={{ label: t('contractUpdateWizard.exitModal.exit'), onClick: onExit }}
    />
  );
};
