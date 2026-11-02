import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { ENV } from '../../../utils/env';
import { ContractUpdateConfirmDialog } from '../../contractUpdateWizard/components/ContractUpdateConfirmDialog';

type Props = {
  open: boolean;
  partyId: string;
  productId: string;
  onClose: () => void;
};

export const PendingRequestDialog = ({ open, partyId, productId, onClose }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const startNewRequest = () =>
    history.push(resolvePathVariables(ENV.ROUTES.CONTRACT_UPDATE, { partyId, productId }), {
      returnTo: `${location.pathname}${location.search}`,
    });

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
        onClick: startNewRequest,
      }}
    />
  );
};
