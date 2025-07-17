import { Box, Grid } from '@mui/material';
import {
  SessionModal,
  useErrorDispatcher,
  useLoading,
  usePermissions,
} from '@pagopa/selfcare-common-frontend/lib';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardApi } from '../../api/DashboardApiClient';
import { GeographicTaxonomyDto } from '../../api/generated/b4f-dashboard/GeographicTaxonomyDto';
import { GeographicTaxonomyResource } from '../../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { ProductOnBoardingStatusEnum } from '../../api/generated/b4f-dashboard/OnboardedProductResource';
import { StatusEnum } from '../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../model/Party';
import { Product, ProductInstitutionMap } from '../../model/Product';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../redux/slices/partiesSlice';
import { mockedCategories } from '../../services/__mocks__/productService';
import { LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES } from '../../utils/constants';
import { ENV } from '../../utils/env';
import ActiveProductsSection from './components/activeProductsSection/ActiveProductsSection';
import { filterProducts } from './components/notActiveProductsSection/components/productFilters';
import NotActiveProductsSection from './components/notActiveProductsSection/NotActiveProductsSection';
import GeoTaxonomySection from './components/partyDetailModal/components/GeoTaxonomySection';
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
  const [openModalAddNewGeographicTaxonomies, setOpenModalAddNewGeographicTaxonomies] =
    useState<boolean>(false);
  const [openModalFirstTimeAddGeographicTaxonomies, setOpenModalFirstTimeAddGeographicTaxonomies] =
    useState<boolean>(false);
  const [optionsSelected, setOptionsSelected] = useState<Array<GeographicTaxonomyResource>>(
    party.geographicTaxonomies ? party.geographicTaxonomies : [{ code: '', desc: '' }]
  );
  const [isAddNewAutocompleteEnabled, setIsAddNewAutocompleteEnabled] = useState<boolean>(false);

  const setLoadingSaveGeotaxonomies = useLoading(LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES);
  const addError = useErrorDispatcher();

  const dispatch = useAppDispatch();
  const setPartyUpdated = (partyUpdated: Party) => {
    dispatch(partiesActions.setPartySelected(partyUpdated));
  };
  const institutionTypesList = useAppSelector(partiesSelectors.selectPartySelectedInstitutionTypes);
  const partyUpdated = useAppSelector(partiesSelectors.selectPartySelected);

  const { t } = useTranslation();

  const { getAllProductsWithPermission } = usePermissions();
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

  const showGeoTaxonomyForInstitutionType = institutionTypesList.some(
    (type) => !['PT', 'SA', 'AS'].includes(type)
  );

  useEffect(() => {
    if (
      ENV.GEOTAXONOMY.SHOW_GEOTAXONOMY &&
      (!party.geographicTaxonomies || party?.geographicTaxonomies?.length === 0) &&
      showGeoTaxonomyForInstitutionType
    ) {
      setOpenModalFirstTimeAddGeographicTaxonomies(true);
    } else if (party.geographicTaxonomies && party?.geographicTaxonomies?.length > 0) {
      setOptionsSelected(party?.geographicTaxonomies);
    } else {
      setOptionsSelected([{ code: '', desc: '' }]);
    }
  }, [party]);

  const handleAddNewTaxonomies = () => {
    setLoadingSaveGeotaxonomies(true);
    DashboardApi.updateInstitutionGeographicTaxonomy(
      party.partyId as string,
      optionsSelected as ReadonlyArray<GeographicTaxonomyDto>
    )
      .then(() => {
        trackEvent('UPDATE_PARTY_GEOGRAPHIC_TAXONOMIES', {
          geographic_taxonomies: optionsSelected,
        });
        setPartyUpdated({ ...party, geographicTaxonomies: optionsSelected });
      })
      .catch((reason: any) =>
        addError({
          id: 'UNSUCCESS_SAVE_TAXONOMIES_INFO',
          blocking: false,
          techDescription: `An error occured while saving geotaxonomies info for party id ${party.partyId}`,
          toNotify: false,
          error: reason,
        })
      )
      .finally(() => {
        setLoadingSaveGeotaxonomies(false);
        setOpenModalAddNewGeographicTaxonomies(false);
        setOpenModalFirstTimeAddGeographicTaxonomies(false);
      });
  };

  return (
    <Box p={3} sx={{ width: '100%' }}>
      <SessionModal
        open={openModalFirstTimeAddGeographicTaxonomies}
        title={t(
          'overview.partyDetail.geographicTaxonomies.firstTimeInsertGeographicTaxonomiesModal.title'
        )}
        message={
          <GeoTaxonomySection
            geographicTaxonomies={partyUpdated?.geographicTaxonomies}
            notFoundAnyTaxonomies={openModalFirstTimeAddGeographicTaxonomies}
            setOptionsSelected={setOptionsSelected}
            setIsAddNewAutocompleteEnabled={setIsAddNewAutocompleteEnabled}
            optionsSelected={optionsSelected}
            isAddNewAutocompleteEnabled={isAddNewAutocompleteEnabled}
          />
        }
        onConfirmLabel={t(
          'overview.partyDetail.geographicTaxonomies.firstTimeInsertGeographicTaxonomiesModal.add'
        )}
        onConfirm={() => handleAddNewTaxonomies()}
        onConfirmEnabled={isAddNewAutocompleteEnabled}
        showCloseButton={false}
        handleClose={() => {}}
      />

      <SessionModal
        open={openModalAddNewGeographicTaxonomies}
        title={t('overview.partyDetail.geographicTaxonomies.addNewGeographicTaxonomiesModal.title')}
        message={
          <GeoTaxonomySection
            geographicTaxonomies={partyUpdated?.geographicTaxonomies}
            notFoundAnyTaxonomies={openModalFirstTimeAddGeographicTaxonomies}
            setOptionsSelected={setOptionsSelected}
            optionsSelected={optionsSelected}
            setIsAddNewAutocompleteEnabled={setIsAddNewAutocompleteEnabled}
            isAddNewAutocompleteEnabled={isAddNewAutocompleteEnabled}
          />
        }
        onConfirmLabel={t(
          'overview.partyDetail.geographicTaxonomies.addNewGeographicTaxonomiesModal.modify'
        )}
        onCloseLabel={t(
          'overview.partyDetail.geographicTaxonomies.addNewGeographicTaxonomiesModal.back'
        )}
        onConfirm={() => handleAddNewTaxonomies()}
        onConfirmEnabled={isAddNewAutocompleteEnabled}
        handleClose={() => {
          setOpenModalAddNewGeographicTaxonomies(false);
        }}
      />
      <PartyDetailModal
        party={party}
        open={open}
        setOpen={setOpen}
        canUploadLogo={canUploadLogo}
        setOpenModalAddNewGeographicTaxonomies={setOpenModalAddNewGeographicTaxonomies}
        showGeoTaxonomyForInstitutionType={showGeoTaxonomyForInstitutionType}
      />
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
