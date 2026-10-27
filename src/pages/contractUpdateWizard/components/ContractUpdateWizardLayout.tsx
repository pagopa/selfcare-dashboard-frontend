import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Container, Typography } from '@mui/material';
import { ButtonNaked, MIButton } from '@pagopa/mui-italia';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES } from '../../../routes';
import { CONTRACT_UPDATE_STEPS, useContractUpdateWizard } from '../ContractUpdateWizardContext';
import { stepComponents, stepValidators } from '../steps';
import { ContractUpdateExitDialog } from './ContractUpdateExitDialog';
import { ContractUpdateSubmitDialog } from './ContractUpdateSubmitDialog';

export const ContractUpdateWizardLayout = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<{ returnTo?: string } | undefined>();
  const { partyId, productId } = useParams<{ partyId: string; productId?: string }>();
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const productName = products?.find((product) => product.id === productId)?.title ?? productId;
  const { state, dispatch } = useContractUpdateWizard();
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
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

  const goNext = () => {
    const isStepValid = stepValidators[stepId]?.(state.draft) ?? true;
    if (!isStepValid) {
      dispatch({ type: 'showErrors' });
    } else if (isLastStep) {
      setSubmitModalOpen(true);
    } else {
      dispatch({ type: 'next' });
    }
  };

  const confirmSubmit = () => {
    setSubmitModalOpen(false);
    // TODO: send the contract update request when the API is available
  };

  return (
    <Container component="main" maxWidth={false} sx={{ maxWidth: 1032, py: 5 }}>
      <ButtonNaked
        component="button"
        color="text"
        size="medium"
        startIcon={<CloseIcon />}
        sx={{ color: (theme) => theme.colors.neutral.black }}
        onClick={() => setExitModalOpen(true)}
      >
        {t('contractUpdateWizard.exit')}
      </ButtonNaked>
      <Typography
        component="h1"
        variant="h4"
        ref={stepHeading}
        tabIndex={-1}
        sx={{
          mt: 2,
          mb: 2,
          color: (theme) => theme.colors.neutral.black,
          '&:focus': { outline: 'none' },
        }}
      >
        {t(`contractUpdateWizard.steps.${stepId}`)}
      </Typography>
      <StepContent />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mt: 6 }}>
        <MIButton variant="outlined" startIcon={<ArrowBackIcon />} onClick={goBack}>
          {t('contractUpdateWizard.back')}
        </MIButton>
        <MIButton variant="contained" onClick={goNext}>
          {t('contractUpdateWizard.continue')}
        </MIButton>
      </Box>
      <ContractUpdateExitDialog
        open={exitModalOpen}
        onStay={() => setExitModalOpen(false)}
        onExit={confirmExit}
      />
      <ContractUpdateSubmitDialog
        open={submitModalOpen}
        productName={productName}
        partyName={party?.description}
        onBack={() => setSubmitModalOpen(false)}
        onConfirm={confirmSubmit}
      />
    </Container>
  );
};
