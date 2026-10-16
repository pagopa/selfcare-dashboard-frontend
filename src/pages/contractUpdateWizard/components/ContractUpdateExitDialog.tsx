import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { MIButton } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onStay: () => void;
  onExit: () => void;
};

export const ContractUpdateExitDialog = ({ open, onStay, onExit }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onStay}
      aria-labelledby="contract-update-exit-title"
      aria-describedby="contract-update-exit-description"
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 600,
          p: 3,
          borderRadius: '16px',
          boxShadow: '0px 4px 32px rgba(14, 15, 19, 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Typography
          id="contract-update-exit-title"
          component="h2"
          variant="h6"
          sx={{
            flex: 1,
            color: (theme) => theme.colors.neutral.black,
            fontWeight: 'fontWeightBold',
            lineHeight: '32px',
          }}
        >
          {t('contractUpdateWizard.exitModal.title')}
        </Typography>
        <IconButton
          aria-label={t('contractUpdateWizard.exitModal.close')}
          onClick={onStay}
          sx={{ p: 0.5, color: (theme) => theme.colors.neutral.black }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography
        id="contract-update-exit-description"
        variant="body2"
        sx={{ mt: 1, color: (theme) => theme.colors.neutral.grey[700] }}
      >
        {t('contractUpdateWizard.exitModal.message')}
      </Typography>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 3 }}
      >
        <MIButton variant="text" onClick={onExit}>
          {t('contractUpdateWizard.exitModal.exit')}
        </MIButton>
        <MIButton variant="contained" onClick={onStay}>
          {t('contractUpdateWizard.exitModal.stay')}
        </MIButton>
      </Box>
    </Dialog>
  );
};
