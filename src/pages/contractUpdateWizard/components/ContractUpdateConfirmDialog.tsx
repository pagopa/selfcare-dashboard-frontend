import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { MIButton } from '@pagopa/mui-italia';

type DialogAction = { label: string; onClick: () => void };

type Props = {
  id: string;
  open: boolean;
  title: string;
  message: string;
  closeLabel: string;
  onClose: () => void;
  secondaryAction: DialogAction;
  primaryAction: DialogAction;
};

export const ContractUpdateConfirmDialog = ({
  id,
  open,
  title,
  message,
  closeLabel,
  onClose,
  secondaryAction,
  primaryAction,
}: Props) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby={`${id}-title`}
    aria-describedby={`${id}-description`}
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
        id={`${id}-title`}
        component="h2"
        variant="h6"
        sx={{
          flex: 1,
          color: (theme) => theme.colors.neutral.black,
          fontWeight: 'fontWeightBold',
          lineHeight: '32px',
        }}
      >
        {title}
      </Typography>
      <IconButton
        aria-label={closeLabel}
        onClick={onClose}
        sx={{ p: 0.5, color: (theme) => theme.colors.neutral.black }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
    <Typography
      id={`${id}-description`}
      variant="body2"
      sx={{ mt: 1, color: (theme) => theme.colors.neutral.grey[700] }}
    >
      {message}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 3 }}>
      <MIButton variant="text" onClick={secondaryAction.onClick}>
        {secondaryAction.label}
      </MIButton>
      <MIButton variant="contained" onClick={primaryAction.onClick}>
        {primaryAction.label}
      </MIButton>
    </Box>
  </Dialog>
);
