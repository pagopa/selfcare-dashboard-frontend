import { Box, Grid, Link, Typography } from '@mui/material';
import { EnvironmentBanner } from '@pagopa/mui-italia';
import {
  SessionModal,
  useErrorDispatcher,
  useLoading,
  usePermissions,
} from '@pagopa/selfcare-common-frontend/lib';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions, PRODUCT_IDS } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DashboardApi } from '../../api/DashboardApiClient';
import { GeographicTaxonomyDto } from '../../api/generated/b4f-dashboard/GeographicTaxonomyDto';
import { GeographicTaxonomyResource } from '../../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { ProductOnBoardingStatusEnum } from '../../api/generated/b4f-dashboard/OnboardedProductResource';
import { StatusEnum } from '../../api/generated/b4f-dashboard/SubProductResource';
import { NotificationsActiveIcon } from '../../components/icons/NotificationActive';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { useLogoExists } from '../../hooks/useLogoExist';
import { Party } from '../../model/Party';
import { Product, ProductInstitutionMap } from '../../model/Product';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../redux/slices/partiesSlice';
import { mockedCategories } from '../../services/__mocks__/productService';
import { getAttachmentStatusService } from '../../services/partyService';
import {
  LINK_UPLOAD_GUIDELINES_SEND,
  LOADING_TASK_FETCH_ATTACHMENT_STATUS,
  LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES,
} from '../../utils/constants';
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
  const [isDoraAddendumSigned, setIsDoraAddendumSigned] = useState<boolean>(false);

  const setLoadingSaveGeotaxonomies = useLoading(LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES);
  const setLoadingGetAttachmentStatus = useLoading(LOADING_TASK_FETCH_ATTACHMENT_STATUS);
  const addError = useErrorDispatcher();

  const dispatch = useAppDispatch();
  const setPartyUpdated = (partyUpdated: Party) => {
    dispatch(partiesActions.setPartySelected(partyUpdated));
  };
  const institutionTypesList = useAppSelector(partiesSelectors.selectPartySelectedInstitutionTypes);
  const partyUpdated = useAppSelector(partiesSelectors.selectPartySelected);

  const { t } = useTranslation();

  const { getAllProductsWithPermission, hasPermission } = usePermissions();
  const canUploadLogo = getAllProductsWithPermission(Actions.UploadLogo).length > 0;
  const canUploadLogoOnSendProduct = hasPermission(PRODUCT_IDS.SEND, Actions.UploadLogo);
  const PSPOnPagoPA = party.products.find(
    (product) =>
      product.productId === PRODUCT_IDS.PAGOPA &&
      product.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE &&
      product.institutionType === 'PSP'
  );
  const canUploadDoraAddendum =
    hasPermission(PRODUCT_IDS.PAGOPA, Actions.ViewContract) && !!PSPOnPagoPA;
  const pagoPATokenIDPSP = PSPOnPagoPA?.tokenId;

  const canSeeActiveProductsList =
    getAllProductsWithPermission(Actions.ListActiveProducts).length > 0;

  const canSeeNotActiveProductsList =
    getAllProductsWithPermission(Actions.ListAvailableProducts).length > 0;

  const logoExists = useLogoExists(party.urlLogo ?? '');

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

  const getAttachmentStatus = () => {
    setLoadingGetAttachmentStatus(true);
    getAttachmentStatusService(
      party.partyId,
      PRODUCT_IDS.PAGOPA,
      'Dichiarazione_sostitutiva_certificazione'
    )
      .then((response) => {
        dispatch(partiesActions.setIsAttachmentAvailable(!!response.isAttachmentAvailable));
        setIsDoraAddendumSigned(!!response.isAttachmentAvailable);
      })
      .catch((error) =>
        addError({
          id: 'UNSUCCESS_GET_ATTACHMENT_STATUS',
          blocking: false,
          techDescription: `An error occured while getting attachment status for party id ${party.partyId}`,
          toNotify: false,
          error,
        })
      )
      .finally(() => {
        setLoadingGetAttachmentStatus(false);
      });
  };

  useEffect(() => {
    getAttachmentStatus();
  }, [party.partyId]);

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
        canUploadLogoOnSendProduct={canUploadLogoOnSendProduct}
        setOpenModalAddNewGeographicTaxonomies={setOpenModalAddNewGeographicTaxonomies}
        showGeoTaxonomyForInstitutionType={showGeoTaxonomyForInstitutionType}
      />
      <WelcomeDashboard setOpen={setOpen} />
      {canUploadLogoOnSendProduct && !logoExists && (
        <Box mt={5} sx={{ '& button': { fontSize: '16px !important' } }}>
          <EnvironmentBanner
            bgColor="info"
            message={
              (
                <Typography>
                  <Trans
                    i18nKey="overview.partyLogo.uploadSendLogoBanner"
                    components={{
                      1: (
                        <Link
                          href={LINK_UPLOAD_GUIDELINES_SEND}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#0E0F13',
                            fontWeight: '700',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            verticalAlign: 'baseline',
                            display: 'inline',
                            lineHeight: 'inherit',
                          }}
                        />
                      ),
                    }}
                  />
                </Typography>
              ) as unknown as string
            }
            actionButton={{
              label: t('overview.partyLogo.uploadTheLogoButton'),
              onClick: () => setOpen(true),
            }}
            icon={<UploadIcon size={20} />}
          />
        </Box>
      )}
      {canUploadDoraAddendum && !isDoraAddendumSigned && (
        <Box mt={5} sx={{ '& button': { fontSize: '16px !important' } }}>
          <EnvironmentBanner
            bgColor="info"
            title={t('overview.dora.title')}
            message={(<Typography>{t('overview.dora.message')}</Typography>) as unknown as string}
            actionButton={{
              label: t('overview.dora.downloadButton'),
              onClick: () =>
                globalThis.location.assign(
                  `${ENV.URL_FE.ONBOARDING}/${pagoPATokenIDPSP}/attachments`
                ),
            }}
            icon={<NotificationsActiveIcon size={20} />}
          />
        </Box>
      )}
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
