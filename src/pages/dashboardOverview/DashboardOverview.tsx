import { Box, Grid } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useState } from 'react';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { mockedCategories } from '../../services/__mocks__/productService';
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
  const { getAllProductsWithPermission } = usePermissions();

  const showInfoBanner = party.institutionType === 'PA';

  const isInstitutionTypeAllowedOnb =
    party.institutionType && !['PT', 'SA', 'AS'].includes(party.institutionType);

  const canUploadLogo = getAllProductsWithPermission(Actions.UploadLogo).length > 0;

  const canSeeActiveProductsList =
    getAllProductsWithPermission(Actions.ListActiveProducts).length > 0;

  const canSeeNotActiveProductsList =
    getAllProductsWithPermission(Actions.ListAvailableProducts).length > 0;

  const getCategoriesOnboardingAllowed = async () => {
    if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
      await Promise.resolve(
        mockedCategories.product['prod-pn']?.ipa.PA?.split(',').map((c: string) => c.trim())
      );
    } else {
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
    }
  };

  useEffect(() => {
    void getCategoriesOnboardingAllowed();
  }, []);

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
        {canSeeNotActiveProductsList &&
          isInstitutionTypeAllowedOnb &&
          products &&
          products.findIndex(
            (product) =>
              product.status === 'ACTIVE' &&
              party.products.map(
                (us) => us.productId === product.id && us.productOnBoardingStatus !== 'ACTIVE'
              )
          ) > -1 && (
            <NotActiveProductsSection
              party={party}
              products={products}
              allowedCategoriesOnProdPN={allowedCategoriesOnProdPN}
            />
          )}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
