import { Alert, Box, Paper, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { contractUpdateWizardColors as colors } from '../../contractUpdateWizardColors';
import { useInstitutionDataStep } from './useInstitutionDataStep';

export const InstitutionDataStep = () => {
  const { t } = useTranslation();
  const { fields, assistanceUrl } = useInstitutionDataStep();

  return (
    <>
      <Typography variant="body2" color={colors.textSecondary}>
        {t('contractUpdateWizard.institutionData.description')}
      </Typography>
      <Alert
        severity="info"
        sx={{ mt: 4, alignItems: 'center', border: 1, borderColor: colors.infoBorder }}
        action={
          <ButtonNaked
            component="a"
            href={assistanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            sx={{ color: 'inherit', fontWeight: 'fontWeightBold' }}
          >
            {t('contractUpdateWizard.institutionData.contactSupport')}
          </ButtonNaked>
        }
      >
        {t('contractUpdateWizard.institutionData.alert')}
      </Alert>
      <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
        <Box component="dl" sx={{ m: 0 }}>
          {fields.map(({ id, label, value }, index) => (
            <Box
              key={id}
              sx={{ py: 1.5, borderTop: index > 0 ? 1 : 0, borderColor: colors.divider }}
            >
              <Typography
                component="dt"
                variant="caption"
                display="block"
                color={colors.textSecondary}
              >
                {label}
              </Typography>
              <Typography
                component="dd"
                variant="body2"
                sx={{
                  m: 0,
                  color: colors.textPrimary,
                  fontWeight: 'fontWeightMedium',
                  wordBreak: 'break-word',
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </>
  );
};
