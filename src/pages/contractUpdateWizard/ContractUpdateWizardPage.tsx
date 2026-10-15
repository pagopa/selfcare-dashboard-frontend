import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { SessionModal } from '@pagopa/selfcare-common-frontend/lib';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withSelectedParty from '../../decorators/withSelectedParty';
import { DASHBOARD_ROUTES } from '../../routes';
import { AdditionalDetailsStep, DetailsStep, InformationStep } from './ContractUpdateSteps';
import {
  CONTRACT_UPDATE_STEPS,
  ContractUpdateWizardProvider,
  useContractUpdateWizard,
} from './ContractUpdateWizardContext';

const stepComponents = {
  information: InformationStep,
  details: DetailsStep,
  additionalDetails: AdditionalDetailsStep,
};

const ContractUpdateWizard = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<{ returnTo?: string } | undefined>();
  const { partyId } = useParams<{ partyId: string }>();
  const { state, dispatch } = useContractUpdateWizard();
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const stepId = CONTRACT_UPDATE_STEPS[state.activeStep];
  const StepContent = stepComponents[stepId];
  const isLastStep = state.activeStep === CONTRACT_UPDATE_STEPS.length - 1;

  useEffect(() => {
    stepHeading.current?.focus();
  }, [state.activeStep]);

  const confirmExit = () => {
    dispatch({ type: 'reset' });
    history.push(resolvePathVariables(DASHBOARD_ROUTES.DOCUMENTS.path, { partyId }));
  };

  const goBack = () => {
    if (state.activeStep === 0) {
      history.replace(
        location.state?.returnTo ??
          resolvePathVariables(DASHBOARD_ROUTES.DOCUMENTS.path, { partyId })
      );
    } else {
      dispatch({ type: 'back' });
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ py: 3 }}>
      <ProductNavigationBar
        showBackComponent
        goBack={() => setExitModalOpen(true)}
        backLabel={t('contractUpdateWizard.exit')}
        colorBackComponent="primary.main"
      />
      <Typography component="h1" variant="h4" ref={stepHeading} tabIndex={-1} sx={{ mt: 3, mb: 4 }}>
        {t(`contractUpdateWizard.steps.${stepId}`)}
      </Typography>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <StepContent />
        {isLastStep && (
          <Typography id="contract-update-submit-unavailable" sx={{ mt: 3 }}>
            {t('contractUpdateWizard.submitUnavailable')}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 5 }}>
          <Button variant="outlined" onClick={goBack}>
            {t('contractUpdateWizard.back')}
          </Button>
          <Button
            variant="contained"
            disabled={isLastStep}
            aria-describedby={isLastStep ? 'contract-update-submit-unavailable' : undefined}
            onClick={() => dispatch({ type: 'next' })}
          >
            {t('contractUpdateWizard.continue')}
          </Button>
        </Box>
      </Paper>
      <SessionModal
        open={exitModalOpen}
        title={t('contractUpdateWizard.exitModal.title')}
        message={t('contractUpdateWizard.exitModal.message')}
        onConfirmLabel={t('contractUpdateWizard.exitModal.confirm')}
        onCloseLabel={t('contractUpdateWizard.exitModal.cancel')}
        handleClose={() => setExitModalOpen(false)}
        onConfirm={confirmExit}
      />
    </Container>
  );
};

export const ContractUpdateWizardPage = () => {
  const { partyId } = useParams<{ partyId: string }>();
  const { search } = useLocation();
  const productId = new URLSearchParams(search).get('productId');

  return (
    <ContractUpdateWizardProvider key={`${partyId}/${productId ?? ''}`}>
      <ContractUpdateWizard />
    </ContractUpdateWizardProvider>
  );
};

export default withSelectedParty(ContractUpdateWizardPage);
