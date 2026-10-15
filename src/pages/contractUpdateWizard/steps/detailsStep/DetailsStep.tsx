import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDetailsStep } from './useDetailsStep';

export const DetailsStep = () => {
  const { t } = useTranslation();
  const { details, setDetails } = useDetailsStep();

  return (
    <TextField
      id="contract-update-details"
      label={t('contractUpdateWizard.detailsField')}
      helperText={t('contractUpdateWizard.fieldHint')}
      fullWidth
      value={details}
      onChange={(event) => setDetails(event.target.value)}
    />
  );
};
