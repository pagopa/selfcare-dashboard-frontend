import { Grid, Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ButtonNaked } from '@pagopa/mui-italia';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { ENV } from '../../utils/env';
import { productsCanSeeDelegation } from '../../utils/constants';
import { DASHBOARD_ROUTES } from '../../routes';
import ActiveProductsSection from './components/activeProductsSection/ActiveProductsSection';
import NotActiveProductsSection from './components/notActiveProductsSection/NotActiveProductsSection';
import WelcomeDashboard from './components/welcomeDashboard/WelcomeDashboard';
import PartyCard from './components/partyCard/PartyCard';
import { PartyLogoUploader } from './components/partyCard/components/partyLogoUploader/PartyLogoUploader';
import DashboardInfoSection from './components/DashboardInfoSection';

type Props = {
  party: Party;
  products: Array<Product>;
};

const DashboardOverview = ({ party, products }: Props) => {
  const canUploadLogo = party.userRole === 'ADMIN';
  const { t } = useTranslation();
  const delegatesRoute = DASHBOARD_ROUTES.DELEGATIONS.path;

  const delegatesPath = resolvePathVariables(delegatesRoute, {
    partyId: party.partyId,
  });
  const activeProducts: Array<Product> =
    useMemo(() => products?.filter((p) => p.productOnBoardingStatus === 'ACTIVE'), [products]) ??
    [];
  const history = useHistory();

  const productsFiltered2Delegations =
    ENV.DELEGATIONS.ENABLE &&
    activeProducts.find((product) =>
      productsCanSeeDelegation.find((p) => product.id === p.prodId)
    ) &&
    canUploadLogo;

  const onExit = useUnloadEventOnExit();

  return (
    <Box p={3} sx={{ width: '100%' }}>
      <WelcomeDashboard />
      <Grid container direction="row" justifyContent={'center'} alignItems="center" mb={2}>
        <Grid item xs={6} display="flex" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: '700' }}>
            {party.description}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <PartyLogoUploader partyId={party.partyId} canUploadLogo={canUploadLogo} />
        </Grid>
      </Grid>
      {canUploadLogo && party.institutionType === 'PA' && productsFiltered2Delegations && (
        <Grid item xs={12} my={2}>
          <DashboardInfoSection />
        </Grid>
      )}
      <Grid item xs={12}>
        <PartyCard party={party} />
      </Grid>
      {canUploadLogo && party.institutionType === 'PA' && !productsFiltered2Delegations ? (
        <Grid item xs={12} mt={2}>
          <DashboardInfoSection />
        </Grid>
      ) : (
        <Grid
          item
          container
          xs={12}
          height="124px"
          mt={2}
          sx={{ borderRadius: '4px', backgroundColor: 'white' }}
        >
          <Box m={3} display="flex" flexDirection={'column'} width="100%">
            <Grid item display="flex">
              <AssignmentIcon />
              <Typography ml={2} variant="h6">
                {t('overview.partyDetail.delegationBanner.title')}
              </Typography>
            </Grid>
            <Grid item mt={2} width="100%" display="flex" justifyContent={'space-between'} xs={12}>
              <Typography variant="body1">
                {t('overview.partyDetail.delegationBanner.subTitle')}
              </Typography>
              <ButtonNaked
                component="button"
                onClick={() =>
                  onExit(() => history.push(party.partyId ? delegatesPath : delegatesRoute))
                }
                endIcon={<ArrowForwardIcon />}
                weight="default"
                size="medium"
                color="primary"
              >
                {t('overview.partyDetail.delegationBanner.goToButton')}
              </ButtonNaked>
            </Grid>
          </Box>
        </Grid>
      )}
      <Grid item xs={12} mb={2} mt={5}>
        <ActiveProductsSection products={products} party={party} />
        {products &&
          products.findIndex(
            (product) => product.status === 'ACTIVE' && product.productOnBoardingStatus !== 'ACTIVE'
          ) > -1 && <NotActiveProductsSection party={party} products={products} />}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
