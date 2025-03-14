import { Alert, Box, Grid } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { ProductOnBoardingStatusEnum } from '../../api/generated/b4f-dashboard/OnboardedProductResource';
import { StatusEnum } from '../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../model/Party';
import { Product, ProductInstitutionMap } from '../../model/Product';
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

  const showInfoBanner = party.institutionType === 'PA';

  const canUploadLogo = getAllProductsWithPermission(Actions.UploadLogo).length > 0;

  const canSeeActiveProductsList =
    getAllProductsWithPermission(Actions.ListActiveProducts).length > 0;

  const canSeeNotActiveProductsList =
    getAllProductsWithPermission(Actions.ListAvailableProducts).length > 0;

  const getOnboardingAllowedByInstitutionType = async () => {
    if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
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
      const filterConfig = {
        institutionType: party.institutionType ?? '',
        categoryCode: party.categoryCode,
        allowedInstitutionTypes,
      };
      const productsWithStatusActive = products.filter((p) => p.status === StatusEnum.ACTIVE);
      const onboardedProducts = party.products.filter(
        (p) => p.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE
      );
      setFilteredProducts(
        filterProducts(productsWithStatusActive, filterConfig, onboardedProducts)
      );
    }
  }, [canSeeNotActiveProductsList, allowedInstitutionTypes, party.partyId]);

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

      <Alert severity="info" sx={{ mt: 5 }}>
        <Trans
          i18nKey="customAlert.message"
          components={{
            1: <strong />,
            2: <strong />,
            3: (
              <ButtonNaked
                component="button"
                color="primary"
                onClick={() =>
                  window.open(
                    'https://docs.pagopa.it/io-guida-tecnica/v5.2-preview',
                    'blank',
                    'noopener,noreferrer'
                  )
                }
                sx={{ textDecoration: 'underline', color: 'primary.main', verticalAlign: 'baseline', }}
              />
            ),
          }}
        >
          {
            "<1>Novità!</1><br />Disponibile dal 31/03/2025 la funzionalità dei <2>Gruppi</2> per IO. Permette di gestire i servizi limitando l'accesso a gruppi specifici di utenti. <3>Come funziona?</3>"
          }
        </Trans>
      </Alert>
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
