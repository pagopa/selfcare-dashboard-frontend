import { Container, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { DASHBOARD_ROUTES } from '../../routes';

type Outcome = 'success' | 'error';

// TODO: placeholder, replace with the OK/KO pages from the design
const ContractUpdateResultPage = ({ outcome }: { outcome: Outcome }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { partyId } = useParams<{ partyId: string }>();

  return (
    <Container component="main" maxWidth={false} sx={{ maxWidth: 1032, py: 5 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
        {t(`contractUpdateWizard.result.${outcome}`)}
      </Typography>
      <ButtonNaked
        component="button"
        color="primary"
        size="medium"
        onClick={() =>
          history.push(resolvePathVariables(DASHBOARD_ROUTES.DOCUMENTS.path, { partyId }))
        }
      >
        {t('contractUpdateWizard.result.backToDocuments')}
      </ButtonNaked>
    </Container>
  );
};

export const ContractUpdateSuccessPage = () => <ContractUpdateResultPage outcome="success" />;

export const ContractUpdateErrorPage = () => <ContractUpdateResultPage outcome="error" />;
