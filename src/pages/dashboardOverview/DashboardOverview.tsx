import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import ActiveProductsSection from './components/activeProductsSection/ActiveProductsSection';
import NotActiveProductsSection from './components/notActiveProductsSection/NotActiveProductsSection';
import { PartyDetailModal } from './components/partyDetailModal/PartyDetailModal';
import WelcomeDashboard from './components/welcomeDashboard/WelcomeDashboard';

type Props = {
  party: Party;
  products: Array<Product>;
};

const DashboardOverview = ({ party, products }: Props) => {
  const [open, setOpen] = useState(false);
  const isAdmin = party.userRole === 'ADMIN';

  const showInfoBanner = party.institutionType === 'PA';

  const isAvaibleProductsVisible =
    party.institutionType && !['PT', 'SA', 'AS'].includes(party.institutionType);

  return (
    <Box p={3} sx={{ width: '100%' }}>
      <PartyDetailModal
        showInfoBanner={showInfoBanner}
        party={party}
        open={open}
        setOpen={setOpen}
        isAdmin={isAdmin}
      />
      <WelcomeDashboard setOpen={setOpen} />

      <Grid item xs={12} mb={2} mt={5}>
        <ActiveProductsSection products={products} party={party} />
        {isAdmin &&
          isAvaibleProductsVisible &&
          products &&
          products.findIndex(
            (product) =>
              product.status === 'ACTIVE' &&
              party.products.map(
                (us) => us.productId === product.id && us.productOnBoardingStatus !== 'ACTIVE'
              )
          ) > -1 && <NotActiveProductsSection party={party} products={products} />}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
