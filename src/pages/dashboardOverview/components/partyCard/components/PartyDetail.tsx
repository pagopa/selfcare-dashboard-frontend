/* eslint-disable complexity */ // TODO: remove eslint-disable complexity (add sub component)
import EditIcon from '@mui/icons-material/Edit';
import { Divider, Grid, Tooltip, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { SessionModal, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend/lib';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardApi } from '../../../../../api/DashboardApiClient';
import { GeographicTaxonomyDto } from '../../../../../api/generated/b4f-dashboard/GeographicTaxonomyDto';
import { GeographicTaxonomyResource } from '../../../../../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { ProductOnBoardingStatusEnum } from '../../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { CountryResource } from '../../../../../model/CountryResource';
import { Party } from '../../../../../model/Party';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../../../../redux/slices/partiesSlice';
import { LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES } from '../../../../../utils/constants';
import { ENV } from '../../../../../utils/env';
import GeoTaxonomySection from './GeoTaxonomySection';
import { PartyDetailField } from './PartyDetailField';

type Props = {
  party: Party;
  institutionTypesList: Array<string>;
};

const labelStyles = {
  color: 'text.secondary',
  fontSize: '14px',
  fontweight: '400px',
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function PartyDetail({ party, institutionTypesList }: Readonly<Props>) {
  const { t } = useTranslation();
  const theme = useTheme();

  const setLoadingSaveGeotaxonomies = useLoading(LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES);
  const addError = useErrorDispatcher();
  const dispatch = useAppDispatch();

  const [openModalAddNewGeographicTaxonomies, setOpenModalAddNewGeographicTaxonomies] =
    useState<boolean>(false);
  const [openModalFirstTimeAddGeographicTaxonomies, setOpenModalFirstTimeAddGeographicTaxonomies] =
    useState<boolean>(false);
  const [optionsSelected, setOptionsSelected] = useState<Array<GeographicTaxonomyResource>>(
    party.geographicTaxonomies ? party.geographicTaxonomies : [{ code: '', desc: '' }]
  );
  const [isAddNewAutocompleteEnabled, setIsAddNewAutocompleteEnabled] = useState<boolean>(false);
  const [countries, setCountries] = useState<Array<CountryResource>>([]);
  const setPartyUpdated = (partyUpdated: Party) => {
    dispatch(partiesActions.setPartySelected(partyUpdated));
  };

  const partyUpdated = useAppSelector(partiesSelectors.selectPartySelected);
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

  const infoStyles = {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.fontSize,
  };

  const institutionTypeTranscode = (institutionType: any) =>
    t(`overview.partyDetail.institutionTypeValue.${institutionType}`);

  const showTooltipAfter = 45;
  const lastPartyVatNumber = party.products[party.products.length - 1]?.billing?.vatNumber;
  const isTaxCodeEquals2Piva = party.fiscalCode === lastPartyVatNumber;
  const uniqueInstitutionTypesList = [...new Set(institutionTypesList)];
  const isInstitutionTypePA = institutionTypesList?.includes('PA');

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

  const isAooUo = party.subunitType === 'AOO' || party.subunitType === 'UO';
  const isForeignInsurence = !!(party.country && party.country !== 'IT');

  const getCountriesJSON = async () => {
    const countries = await fetch(ENV.JSON_URL.COUNTRIES);
    setCountries(await countries.json());
  };

  useEffect(() => {
    if (isForeignInsurence && countries.length === 0) {
      void getCountriesJSON();
    }
  }, [isForeignInsurence]);

  const getCountryNameByAlpha2 = (
    countries: Array<CountryResource>,
    alpha2?: string
  ): string | undefined => {
    const matchingCountry = countries.find((country) => country.alpha_2 === alpha2);
    return matchingCountry?.name ? `- ${matchingCountry.name}` : '';
  };

  function capitalizeFirstLetter(str?: string): string | undefined {
    if (!str) {
      return undefined;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const formattedForeignAddress = `${party.registeredOffice}, ${capitalizeFirstLetter(
    party.city
  )} ${getCountryNameByAlpha2(countries, party.country)}`;

  const getTooltipText = (
    isForeignInsurence: boolean,
    formattedForeignAddress: string,
    registeredOffice: string,
    showTooltipAfter: number
  ): string | undefined => {
    if (isForeignInsurence && formattedForeignAddress.length >= showTooltipAfter) {
      return formattedForeignAddress;
    } else if (registeredOffice.length >= showTooltipAfter) {
      return registeredOffice;
    } else {
      return '';
    }
  };

  const ipaCodeForPa = party.products
    .filter((product) => product.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE)
    .find((product) => product.institutionType === 'PA')?.originId;

  // Helper function to get tooltip text for simple cases

  const getSimpleTooltipText = (text?: string): string =>
    text && text.length >= showTooltipAfter ? text : '';

  return (
    <>
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          {/* companyName */}
          <PartyDetailField
            label={t(
              isAooUo ? 'overview.partyDetail.denomination' : 'overview.partyDetail.companyName'
            )}
            value={party.description}
            tooltipText={getSimpleTooltipText(party.description)}
            showDivider={false}
          />

          {/* institutionType */}
          {uniqueInstitutionTypesList.length < 2 && (
            <PartyDetailField
              label={t('overview.partyDetail.institutionType')}
              value={institutionTypeTranscode(uniqueInstitutionTypesList[0])}
              tooltipText={getSimpleTooltipText(
                institutionTypeTranscode(uniqueInstitutionTypesList[0])
              )}
            />
          )}

          {/* category */}
          {uniqueInstitutionTypesList.length < 2 && party.category && (
            <PartyDetailField
              label={t('overview.partyDetail.category')}
              value={party.category}
              tooltipText={getSimpleTooltipText(party.category)}
            />
          )}

          {/* structure */}
          {isAooUo && (
            <PartyDetailField
              label={t('overview.partyDetail.structure')}
              value={
                party.subunitType === 'AOO'
                  ? 'Area Organizzativa Omogenea'
                  : party.subunitType === 'UO'
                  ? 'Unità Organizzativa'
                  : ''
              }
            />
          )}

          {/* geographicTaxonomy */}
          {ENV.GEOTAXONOMY.SHOW_GEOTAXONOMY && showGeoTaxonomyForInstitutionType && (
            <Grid item xs={12}>
              <Divider sx={{ mb: 1 }} />
              <Grid container>
                <Grid item xs={8}>
                  {
                    <Grid item xs={12}>
                      <Typography component="span" variant="body2" sx={{ ...labelStyles }}>
                        {t('overview.partyDetail.geographicTaxonomies.label')}
                      </Typography>
                    </Grid>
                  }
                  <Grid item xs={12}>
                    <Tooltip
                      title={
                        partyUpdated?.description &&
                        partyUpdated.description.length >= showTooltipAfter
                          ? partyUpdated.description
                          : ''
                      }
                      placement="top"
                      arrow={true}
                    >
                      <Typography
                        sx={{
                          ...infoStyles,
                          maxWidth: '100% !important',
                          textTransform: 'capitalize',
                        }}
                        className="ShowDots"
                        component="span"
                      >
                        {partyUpdated?.geographicTaxonomies
                          ? partyUpdated?.geographicTaxonomies[0]?.desc?.toLocaleLowerCase()
                          : '-'}
                      </Typography>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid item xs={3} display="flex" justifyContent="flex-end">
                  {partyUpdated?.geographicTaxonomies &&
                    partyUpdated.geographicTaxonomies.length >= 1 && (
                      <ButtonNaked
                        component="button"
                        onClick={() => setOpenModalAddNewGeographicTaxonomies(true)}
                        endIcon={<EditIcon sx={{ height: '18px', width: '18px' }} />}
                        sx={{ color: 'primary.main', flexDirection: 'row' }}
                        weight="default"
                      >
                        {partyUpdated?.geographicTaxonomies.length !== 1
                          ? '+' + `${partyUpdated.geographicTaxonomies.length - 1}`
                          : undefined}
                      </ButtonNaked>
                    )}
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* origin (ipa code) */}
          {isInstitutionTypePA && !isAooUo && (
            <PartyDetailField
              label={`${t('overview.partyDetail.originId')} ${party.origin}`}
              value={ipaCodeForPa}
              tooltipText={getSimpleTooltipText(ipaCodeForPa)}
            />
          )}

          {/* uniqueCode for AOO/UO */}
          {isAooUo && (
            <PartyDetailField
              label={t('overview.partyDetail.uniqueCode')}
              value={party.subunitCode}
              tooltipText={getSimpleTooltipText(party.originId)}
            />
          )}

          {/* fiscalCode for non-PA */}
          {!isInstitutionTypePA && party.fiscalCode && (
            <PartyDetailField
              label={
                isTaxCodeEquals2Piva
                  ? t('overview.partyDetail.isTaxCodeEquals2Piva')
                  : t('overview.partyDetail.fiscalCode')
              }
              value={party.fiscalCode}
              tooltipText={getSimpleTooltipText(party.fiscalCode)}
            />
          )}

          {/* vatNumberGroup */}
          {institutionTypesList?.includes('PSP') && (
            <PartyDetailField
              label={t('overview.partyDetail.vatNumberGroup')}
              value={
                party.vatNumberGroup === true
                  ? t('overview.partyDetail.vatNumberGroupValues.yes')
                  : t('overview.partyDetail.vatNumberGroupValues.no')
              }
            />
          )}

          {/* fiscalCode for PA */}
          {isInstitutionTypePA && party.fiscalCode && (
            <PartyDetailField
              label={
                isTaxCodeEquals2Piva
                  ? t('overview.partyDetail.isTaxCodeEquals2Piva')
                  : t('overview.partyDetail.fiscalCode')
              }
              value={party.fiscalCode}
              tooltipText={getSimpleTooltipText(party.fiscalCode)}
            />
          )}

          {/* vatNumber */}
          {!isTaxCodeEquals2Piva && lastPartyVatNumber && (
            <PartyDetailField
              label={t('overview.partyDetail.vatNumber')}
              value={lastPartyVatNumber}
              tooltipText={getSimpleTooltipText(lastPartyVatNumber)}
            />
          )}

          {/* pecEmail */}
          <PartyDetailField
            label={t('overview.partyDetail.pec')}
            value={party.digitalAddress}
            tooltipText={getSimpleTooltipText(party.digitalAddress)}
          />

          {/* registeredOffice */}
          <PartyDetailField
            label={t('overview.partyDetail.registeredOffice')}
            value={
              isForeignInsurence
                ? formattedForeignAddress
                : party.zipCode
                ? `${party.registeredOffice} - ${party.zipCode}`
                : party.registeredOffice
            }
            tooltipText={getTooltipText(
              isForeignInsurence,
              formattedForeignAddress,
              party.registeredOffice,
              showTooltipAfter
            )}
          />

          {/* aooParentCode */}
          {party.aooParentCode && party.subunitType === 'UO' && (
            <PartyDetailField
              label={t('overview.partyDetail.aooParentCode')}
              value={party.aooParentCode}
            />
          )}
        </Grid>
      </Grid>

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
    </>
  );
}
