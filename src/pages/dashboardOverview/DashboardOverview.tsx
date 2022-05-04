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
    <Box sx={{ width: '985px', padding: '0 16px' }}>
      <WelcomeDashboard />
      <Grid container direction="row" justifyContent={'center'} mb={2}>
        <Grid item xs={6} display="flex" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {party.description}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h1">
            <PartyLogoUploader institutionId={party.institutionId} canUploadLogo={canUploadLogo} />
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <PartyCard party={party} />
      </Grid>
      <Grid item xs={12} my={2}>
        {canUploadLogo && <DashboardInfoSection />}
      </Grid>

      <ActiveProductsSection products={products} party={party} />
      {products && products.findIndex((product) => product.status !== 'ACTIVE') > -1 && (
        <NotActiveProductsSection party={party} products={products} />
      )}
    </Box>
  );
};

export default DashboardOverview;
