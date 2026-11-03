import { Box, Stack, Typography } from '@mui/material';
import { IllusMICompleted, IllusMIMaintenance, MIButton } from '@pagopa/mui-italia';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES } from '../../routes';
import { fetchProductsContractUpdateStatus } from '../../services/contractUpdateService';
import { ENV } from '../../utils/env';
import { ContractUpdateNextProductDialog } from './components/ContractUpdateNextProductDialog';

type Outcome = 'success' | 'error';

// The submitted product can still report contractUpdateRequired while its request is processed asynchronously,
// so it is excluded together with products already in progress to avoid proposing the same update again.
const useNextProductToUpdate = (enabled: boolean, partyId: string, productId: string) => {
  const [nextProductId, setNextProductId] = useState<string>();

  useEffect(() => {
    if (!enabled) {
      return;
    }
    // eslint-disable-next-line functional/no-let
    let active = true;
    fetchProductsContractUpdateStatus(partyId)
      .then((statuses) => {
        if (active) {
          setNextProductId(
            statuses.find(
              (s) =>
                s.productId !== productId && s.contractUpdateRequired && !s.contractUpdateInProgress
            )?.productId
          );
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [enabled, partyId, productId]);

  return nextProductId;
};

const ContractUpdateResultPage = ({ outcome }: { outcome: Outcome }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { partyId, productId } = useParams<{ partyId: string; productId: string }>();
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const nextProductId = useNextProductToUpdate(outcome === 'success', partyId, productId);
  const [nextProductModalOpen, setNextProductModalOpen] = useState(false);
  // DASHBOARD_ROUTES must be read at render time: routes.tsx imports this module (circular import)
  const Illustration = outcome === 'success' ? IllusMICompleted : IllusMIMaintenance;
  const backRoute =
    outcome === 'success' ? DASHBOARD_ROUTES.DOCUMENTS.path : DASHBOARD_ROUTES.OVERVIEW.path;
  const goBack = () => history.push(resolvePathVariables(backRoute, { partyId }));

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
        onClick={() => (nextProductId ? setNextProductModalOpen(true) : goBack())}
      >
        {t(`contractUpdateWizard.result.${outcome}.button`)}
      </MIButton>
      {nextProductId && (
        <ContractUpdateNextProductDialog
          open={nextProductModalOpen}
          productName={products?.find((p) => p.id === nextProductId)?.title ?? nextProductId}
          onClose={() => setNextProductModalOpen(false)}
          onBackToDocuments={goBack}
          onContinue={() =>
            history.push(
              resolvePathVariables(ENV.ROUTES.CONTRACT_UPDATE, {
                partyId,
                productId: nextProductId,
              })
            )
          }
        />
      )}
    </Box>
  );
};

export const ContractUpdateSuccessPage = () => <ContractUpdateResultPage outcome="success" />;

export const ContractUpdateErrorPage = () => <ContractUpdateResultPage outcome="error" />;
