import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContractUpdateWizard } from './ContractUpdateWizardContext';

export const InformationStep = () => {
  const { t } = useTranslation();
  return <Typography>{t('contractUpdateWizard.informationContent')}</Typography>;
};

export const DetailsStep = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContractUpdateWizard();
  return (
    <TextField
      id="contract-update-details"
      label={t('contractUpdateWizard.detailsField')}
      helperText={t('contractUpdateWizard.fieldHint')}
      fullWidth
      value={state.draft.details}
      onChange={(event) =>
        dispatch({ type: 'updateDraft', field: 'details', value: event.target.value })
      }
    />
  );
};

export const AdditionalDetailsStep = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContractUpdateWizard();
  return (
    <TextField
      id="contract-update-additional-details"
      label={t('contractUpdateWizard.additionalDetailsField')}
      helperText={t('contractUpdateWizard.fieldHint')}
      fullWidth
      value={state.draft.additionalDetails}
      onChange={(event) =>
        dispatch({ type: 'updateDraft', field: 'additionalDetails', value: event.target.value })
      }
    />
  );
};
