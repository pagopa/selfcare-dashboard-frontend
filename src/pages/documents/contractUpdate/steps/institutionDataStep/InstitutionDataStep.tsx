import { Box, Typography } from '@mui/material';
import { MIAlert, MIPaper } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { useInstitutionDataStep } from './useInstitutionDataStep';

export const InstitutionDataStep = () => {
  const { t } = useTranslation();
  const { fields, assistanceUrl } = useInstitutionDataStep();

  return (
    <>
      <Typography variant="body2" sx={{ color: (theme) => theme.colors.neutral.grey[700] }}>
        {t('contractUpdateWizard.institutionData.description')}
      </Typography>
      <MIAlert
        severity="info"
        sx={{ mt: 4 }}
        action={{
          label: t('contractUpdateWizard.institutionData.contactSupport'),
          href: assistanceUrl,
          target: '_blank',
        }}
      >
        {t('contractUpdateWizard.institutionData.alert')}
      </MIAlert>
      <MIPaper padding={24} sx={{ mt: 4 }}>
        <Box component="dl" sx={{ m: 0 }}>
          {fields.map(({ id, label, value }, index) => (
            <Box
              key={id}
              sx={{
                py: 1.5,
                borderTop: index > 0 ? 1 : 0,
                borderColor: (theme) => theme.colors.neutral.grey[100],
              }}
            >
              <Typography
                component="dt"
                variant="caption"
                display="block"
                sx={{ color: (theme) => theme.colors.neutral.grey[700] }}
              >
                {label}
              </Typography>
              <Typography
                component="dd"
                variant="body2"
                sx={{
                  m: 0,
                  color: (theme) => theme.colors.neutral.black,
                  fontWeight: 'fontWeightMedium',
                  wordBreak: 'break-word',
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </MIPaper>
    </>
  );
};
