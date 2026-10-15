import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Container, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DASHBOARD_ROUTES } from '../../../routes';
import { CONTRACT_UPDATE_STEPS, useContractUpdateWizard } from '../ContractUpdateWizardContext';
import { contractUpdateWizardColors as colors } from '../contractUpdateWizardColors';
import { stepComponents } from '../steps';
import { ContractUpdateExitDialog } from './ContractUpdateExitDialog';

export const ContractUpdateWizardLayout = () => {
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
    <Container component="main" maxWidth={false} sx={{ maxWidth: 1032, py: 5 }}>
      <ButtonNaked
        component="button"
        color="text"
        size="medium"
        startIcon={<CloseIcon />}
        onClick={() => setExitModalOpen(true)}
      >
        {t('contractUpdateWizard.exit')}
      </ButtonNaked>
      <Typography
        component="h1"
        variant="h4"
        ref={stepHeading}
        tabIndex={-1}
        sx={{ mt: 2, mb: 2, color: colors.textPrimary, '&:focus': { outline: 'none' } }}
      >
        {t(`contractUpdateWizard.steps.${stepId}`)}
      </Typography>
      <StepContent />
      {isLastStep && (
        <Typography id="contract-update-submit-unavailable" sx={{ mt: 3 }}>
          {t('contractUpdateWizard.submitUnavailable')}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mt: 6 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
          sx={{
            color: colors.primary,
            borderColor: colors.primary,
            '&:hover': { color: colors.primaryHover, borderColor: colors.primaryHover },
          }}
        >
          {t('contractUpdateWizard.back')}
        </Button>
        <Button
          variant="contained"
          disabled={isLastStep}
          aria-describedby={isLastStep ? 'contract-update-submit-unavailable' : undefined}
          onClick={() => dispatch({ type: 'next' })}
          sx={{
            bgcolor: colors.primary,
            '&:hover': { bgcolor: colors.primaryHover },
          }}
        >
          {t('contractUpdateWizard.continue')}
        </Button>
      </Box>
      <ContractUpdateExitDialog
        open={exitModalOpen}
        onStay={() => setExitModalOpen(false)}
        onExit={confirmExit}
      />
    </Container>
  );
};
