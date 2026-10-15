import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAdditionalDetailsStep } from './useAdditionalDetailsStep';

export const AdditionalDetailsStep = () => {
  const { t } = useTranslation();
  const { additionalDetails, setAdditionalDetails } = useAdditionalDetailsStep();

  return (
    <TextField
      id="contract-update-additional-details"
      label={t('contractUpdateWizard.additionalDetailsField')}
      helperText={t('contractUpdateWizard.fieldHint')}
      fullWidth
      value={additionalDetails}
      onChange={(event) => setAdditionalDetails(event.target.value)}
    />
  );
};
