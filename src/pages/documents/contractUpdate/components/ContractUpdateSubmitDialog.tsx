import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { ContractUpdateConfirmDialog } from './ContractUpdateConfirmDialog';

type Props = {
  open: boolean;
  productName?: string;
  partyName?: string;
  onBack: () => void;
  onConfirm: () => void;
};

export const ContractUpdateSubmitDialog = ({
  open,
  productName,
  partyName,
  onBack,
  onConfirm,
}: Props) => {
  const { t } = useTranslation();

  return (
    <ContractUpdateConfirmDialog
      id="contract-update-submit"
      open={open}
      title={t('contractUpdateWizard.submitModal.title')}
      message={
        <>
          <Typography variant="body2" color="inherit" sx={{ mb: 1.5 }}>
            <Trans
              i18nKey="contractUpdateWizard.submitModal.message"
              values={{ productName, partyName }}
              components={{ 1: <strong />, 2: <strong /> }}
            >
              {`Stai inviando il documento con la richiesta di adesione al prodotto <1>{{productName}}</1> per l’ente <2>{{partyName}}</2>.`}
            </Trans>
          </Typography>
          <Typography variant="body2" color="inherit">
            {t('contractUpdateWizard.submitModal.description')}
          </Typography>
        </>
      }
      closeLabel={t('contractUpdateWizard.submitModal.close')}
      onClose={onBack}
      secondaryAction={{ label: t('contractUpdateWizard.submitModal.back'), onClick: onBack }}
      primaryAction={{ label: t('contractUpdateWizard.submitModal.confirm'), onClick: onConfirm }}
    />
  );
};
