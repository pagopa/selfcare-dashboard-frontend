import { Box, Grid } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useState } from 'react';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { ENV } from '../../utils/env';
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
  const [allowedCategoriesOnProdPN, setAllowedCategoriesOnProdPN] = useState<Array<string>>([]);

  const { getAllProductsWithPermission, hasPermission } = usePermissions();

  const getCategoriesOnboardingAllowed = async () => {
    try {
      const response = await fetch(ENV.BASE_PATH_CDN_URL + '/assets/config.json');

      if (!response.ok) {
        console.error(`Failed to fetch config.json: ${response.status} - ${response.statusText}`);
        return;
      }

      const categoriesAllowedJSON = await response.json();

      const categoriesStringToArray = categoriesAllowedJSON?.product['prod-pn']?.ipa.PA?.split(
        ','
      ).map((c: string) => c.trim());

      setAllowedCategoriesOnProdPN(categoriesStringToArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void getCategoriesOnboardingAllowed();
  }, []);

  const showInfoBanner = party.institutionType === 'PA';

  const isInstitutionTypeAllowedOnb = (product: Product) =>
    !['PT', 'SA', 'AS'].includes(party.institutionType ?? '') &&
    !(party.institutionType === 'PSP' && product.id === 'prod-pagopa') &&
    !(product.id === 'prod-pn' && !allowedCategoriesOnProdPN.includes(party.categoryCode ?? ''));

  const canUploadLogo = getAllProductsWithPermission(Actions.UploadLogo).length > 0;

  const canSeeActiveProductsList =
    getAllProductsWithPermission(Actions.ListActiveProducts).length > 0;

  const canSeeNotActiveProductsList =
    getAllProductsWithPermission(Actions.ListAvailableProducts).length > 0;

  const filteredProducts = products.filter((product) => {
    const isActive = product.status === 'ACTIVE';
    const isInstitutionAllowed = isInstitutionTypeAllowedOnb(product);

    const isOnboarded = party.products.some(
      (pp) => pp.productId === product.id && pp.productOnBoardingStatus === 'ACTIVE'
    );

    const hasEligibleSubProducts =
      product.subProducts &&
      party.products.find(
        (pp) =>
          pp.productId === product.id &&
          pp.productOnBoardingStatus === 'ACTIVE' &&
          hasPermission(pp.productId, Actions.AccessProductBackoffice)
      );

    return isActive && (!isOnboarded || hasEligibleSubProducts) && isInstitutionAllowed;
  });

  return (
    <Box p={3} sx={{ width: '100%' }}>
      <PartyDetailModal
        showInfoBanner={showInfoBanner}
        party={party}
        open={open}
        setOpen={setOpen}
        canUploadLogo={canUploadLogo}
      />
      <WelcomeDashboard setOpen={setOpen} />

      <Grid item xs={12} mb={2} mt={5}>
        {canSeeActiveProductsList && <ActiveProductsSection products={products} party={party} />}
        {canSeeNotActiveProductsList && filteredProducts && filteredProducts.length > -1 && (
          <NotActiveProductsSection party={party} filteredProducts={filteredProducts} />
        )}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
