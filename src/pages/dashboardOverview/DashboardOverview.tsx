import { Box, Grid } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useState } from 'react';
import { ProductOnBoardingStatusEnum } from '../../api/generated/b4f-dashboard/OnboardedProductResource';
import { StatusEnum } from '../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../model/Party';
import { Product, ProductInstitutionMap } from '../../model/Product';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { mockedCategories } from '../../services/__mocks__/productService';
import { ENV } from '../../utils/env';
import ActiveProductsSection from './components/activeProductsSection/ActiveProductsSection';
import { filterProducts } from './components/notActiveProductsSection/components/productFilters';
import NotActiveProductsSection from './components/notActiveProductsSection/NotActiveProductsSection';
import { PartyDetailModal } from './components/partyDetailModal/PartyDetailModal';
import WelcomeDashboard from './components/welcomeDashboard/WelcomeDashboard';

type Props = {
  party: Party;
  products: Array<Product>;
};

const DashboardOverview = ({ party, products }: Props) => {
  const [open, setOpen] = useState(false);
  const [allowedInstitutionTypes, setAllowedInstitutionTypes] = useState<ProductInstitutionMap>();
  const [filteredProducts, setFilteredProducts] = useState<Array<Product>>([]);

  const { getAllProductsWithPermission } = usePermissions();
  const institutionTypesList = useAppSelector(partiesSelectors.selectPartySelectedInstitutionTypes);

  const canUploadLogo = getAllProductsWithPermission(Actions.UploadLogo).length > 0;

  const canSeeActiveProductsList =
    getAllProductsWithPermission(Actions.ListActiveProducts).length > 0;

  const canSeeNotActiveProductsList =
    getAllProductsWithPermission(Actions.ListAvailableProducts).length > 0;

  const getOnboardingAllowedByInstitutionType = async () => {
    if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
      setAllowedInstitutionTypes(mockedCategories);
      await Promise.resolve(mockedCategories);
    } else {
      try {
        const response = await fetch(
          ENV.BASE_PATH_CDN_URL + '/assets/product_institution_types.json'
        );

        if (!response.ok) {
          console.error(`Failed to fetch config.json: ${response.status} - ${response.statusText}`);
          return;
        }

        setAllowedInstitutionTypes(await response.json());
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    void getOnboardingAllowedByInstitutionType();
  }, []);

  useEffect(() => {
    if (canSeeNotActiveProductsList && allowedInstitutionTypes && party) {
      const filterByConfig = {
        institutionTypesList: institutionTypesList || [],
        categoryCode: party.categoryCode,
        allowedInstitutionTypes,
      };

      const productsWithStatusActive = products.filter((p) => p.status === StatusEnum.ACTIVE);
      const onboardedProducts = party.products.filter(
        (p) => p.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE
      );

      const filteredResult = filterProducts(
        productsWithStatusActive,
        filterByConfig,
        onboardedProducts
      );
      setFilteredProducts([...filteredResult]);
    }
  }, [canSeeNotActiveProductsList, allowedInstitutionTypes, party.partyId]);

  return (
    <Box p={3} sx={{ width: '100%' }}>
      <PartyDetailModal party={party} open={open} setOpen={setOpen} canUploadLogo={canUploadLogo} />
      <WelcomeDashboard setOpen={setOpen} />

      <Grid item xs={12} mb={2} mt={5}>
        {canSeeActiveProductsList && <ActiveProductsSection products={products} party={party} />}
        {canSeeNotActiveProductsList && filteredProducts.length > 0 && (
          <NotActiveProductsSection party={party} filteredProducts={filteredProducts} />
        )}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
