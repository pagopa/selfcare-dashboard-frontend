import CloseIcon from '@mui/icons-material/Close';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  productName: string;
  onClose: () => void;
};

export default function BackofficeNotIntegratedModal({
  open,
  productName,
  onClose,
}: Readonly<Props>) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 4,
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: 'black' }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            width: 53,
            height: 53,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            backgroundColor: '#CED8F9 !important',
          }}
        >
          <PriorityHighOutlinedIcon sx={{ color: '#0B3EE3 !important', fontSize: 32 }} />
        </Box>

        <Typography variant="h6" fontWeight="bold" mb={1}>
          {t('adminPage.backofficeNotIntegratedModal.title')}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          <Trans
            i18nKey="adminPage.backofficeNotIntegratedModal.description"
            values={{ productName }}
            components={{
              1: <strong />,
            }}
          >
            {`Ci dispiace, <1>{{productName}}</1> non è disponibile al momento.`}
          </Trans>
        </Typography>
        <Button variant="contained" onClick={onClose} sx={{ borderRadius: 2, px: 4 }}>
          {t('adminPage.backofficeNotIntegratedModal.close')}
        </Button>
      </Box>
    </Modal>
  );
}
