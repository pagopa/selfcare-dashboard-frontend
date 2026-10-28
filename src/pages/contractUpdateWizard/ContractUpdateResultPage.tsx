import { Box, Stack, Typography } from '@mui/material';
import { IllusMICompleted, IllusMIMaintenance, MIButton } from '@pagopa/mui-italia';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { DASHBOARD_ROUTES } from '../../routes';

type Outcome = 'success' | 'error';

const ContractUpdateResultPage = ({ outcome }: { outcome: Outcome }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { partyId } = useParams<{ partyId: string }>();
  // DASHBOARD_ROUTES must be read at render time: routes.tsx imports this module (circular import)
  const Illustration = outcome === 'success' ? IllusMICompleted : IllusMIMaintenance;
  const backRoute =
    outcome === 'success' ? DASHBOARD_ROUTES.DOCUMENTS.path : DASHBOARD_ROUTES.OVERVIEW.path;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        py: 8,
        px: 3,
        backgroundColor: (theme) => theme.colors.neutral.grey[50],
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ maxWidth: 368, textAlign: 'center' }}>
        <Illustration size={56} />
        <Stack spacing={1}>
          <Typography component="h1" variant="h4">
            {t(`contractUpdateWizard.result.${outcome}.title`)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t(`contractUpdateWizard.result.${outcome}.description`)}
          </Typography>
        </Stack>
      </Stack>
      <MIButton
        variant="contained"
        size="large"
        onClick={() => history.push(resolvePathVariables(backRoute, { partyId }))}
      >
        {t(`contractUpdateWizard.result.${outcome}.button`)}
      </MIButton>
    </Box>
  );
};

export const ContractUpdateSuccessPage = () => <ContractUpdateResultPage outcome="success" />;

export const ContractUpdateErrorPage = () => <ContractUpdateResultPage outcome="error" />;
