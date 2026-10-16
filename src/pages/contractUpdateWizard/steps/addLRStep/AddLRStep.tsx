import { Paper, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLRStep } from './useLRStep';

export const AddLRStep = () => {
  const { t } = useTranslation();
  const { details, setDetails } = useLRStep();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <TextField
        id="contract-update-details"
        label={t('contractUpdateWizard.detailsField')}
        helperText={t('contractUpdateWizard.fieldHint')}
        fullWidth
        value={details}
        onChange={(event) => setDetails(event.target.value)}
      />
    </Paper>
  );
};
