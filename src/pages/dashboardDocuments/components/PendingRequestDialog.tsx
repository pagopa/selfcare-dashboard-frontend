import { useTranslation } from 'react-i18next';
import { ContractUpdateConfirmDialog } from '../../contractUpdateWizard/components/ContractUpdateConfirmDialog';

type Props = {
  open: boolean;
  onClose: () => void;
  onNewRequest: () => void;
};

export const PendingRequestDialog = ({ open, onClose, onNewRequest }: Props) => {
  const { t } = useTranslation();

  return (
    <ContractUpdateConfirmDialog
      id="documents-pending-request"
      open={open}
      title={t('documents.pendingRequestModal.title')}
      message={t('documents.pendingRequestModal.message')}
      closeLabel={t('documents.pendingRequestModal.close')}
      onClose={onClose}
      secondaryAction={{ label: t('documents.pendingRequestModal.back'), onClick: onClose }}
      primaryAction={{
        label: t('documents.pendingRequestModal.newRequest'),
        onClick: onNewRequest,
      }}
    />
  );
};
