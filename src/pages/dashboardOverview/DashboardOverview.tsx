import { Grid, Box, Typography } from '@mui/material';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
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
  return (
    <div>
      <Box p={3} sx={{ width: '100%' }}>
        <WelcomeDashboard />
        <Grid container direction="row" justifyContent={'center'} mb={2}>
          <Grid item xs={6} display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              {party.description}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <PartyLogoUploader partyId={party.partyId} canUploadLogo={canUploadLogo} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <PartyCard party={party} />
        </Grid>
        {canUploadLogo && (
          <Grid item xs={12} mt={2}>
            <DashboardInfoSection />
          </Grid>
        )}
        <Grid item xs={12} mb={2} mt={5}>
          <ActiveProductsSection products={products} party={party} />
          {products && products.findIndex((product) => product.status !== 'ACTIVE') > -1 && (
            <NotActiveProductsSection party={party} products={products} />
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default DashboardOverview;
