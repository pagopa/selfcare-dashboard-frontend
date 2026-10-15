import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const InformationStep = () => {
  const { t } = useTranslation();
  return <Typography>{t('contractUpdateWizard.informationContent')}</Typography>;
};
