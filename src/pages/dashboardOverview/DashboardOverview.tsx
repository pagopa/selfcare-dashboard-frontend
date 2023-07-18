import { Grid, Box, Typography } from '@mui/material';
import { useMemo } from 'react';

import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { ENV } from '../../utils/env';
import { productsCanSeeDelegation } from '../../utils/constants';
import DashboardDelegationsBanner from '../dashboardDelegations/DashboardDelegationsBanner';
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

  const activeProducts: Array<Product> =
    useMemo(
      () =>
        products?.filter((p) => p.productOnBoardingStatus === 'ACTIVE' && p.authorized === true),
      [products]
    ) ?? [];

  const productsFiltered2Delegations =
    ENV.DELEGATIONS.ENABLE &&
    activeProducts.find((product) =>
      productsCanSeeDelegation.find((p) => product.id === p.prodId)
    ) &&
    canUploadLogo;

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
      {party.institutionType === 'PA' && productsFiltered2Delegations && (
        <Grid item xs={12} my={2}>
          <DashboardInfoSection />
        </Grid>
      )}
      <Grid item xs={12}>
        <PartyCard party={party} />
      </Grid>
      {party.institutionType === 'PA' && !productsFiltered2Delegations ? (
        <Grid item xs={12} mt={2}>
          <DashboardInfoSection />
        </Grid>
      ) : (
        <DashboardDelegationsBanner party={party} />
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
