import { Paper, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAddUsersStep } from './useAddUsersStep';

export const AddUsersStep = () => {
  const { t } = useTranslation();
  const { additionalDetails, setAdditionalDetails } = useAddUsersStep();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <TextField
        id="contract-update-additional-details"
        label={t('contractUpdateWizard.additionalDetailsField')}
        helperText={t('contractUpdateWizard.fieldHint')}
        fullWidth
        value={additionalDetails}
        onChange={(event) => setAdditionalDetails(event.target.value)}
      />
    </Paper>
  );
};
