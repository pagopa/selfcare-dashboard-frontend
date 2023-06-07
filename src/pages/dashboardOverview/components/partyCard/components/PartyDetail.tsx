/* eslint-disable complexity */ // TODO: remove eslint-disable complexity (add sub component)
import { Grid, Tooltip, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { SessionModal, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { GeographicTaxonomy, Party } from '../../../../../model/Party';
import { LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES } from '../../../../../utils/constants';
import { DashboardApi } from '../../../../../api/DashboardApiClient';
import { ENV } from '../../../../../utils/env';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../../../../redux/slices/partiesSlice';
import GeoTaxonomySection from './GeoTaxonomySection';

type Props = {
  party: Party;
};

const labelStyles = {
  color: 'text.colorTextPrimary',
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function PartyDetail({ party }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  const setLoadingSaveGeotaxonomies = useLoading(LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES);
  const addError = useErrorDispatcher();
  const dispatch = useAppDispatch();

  const [openModalAddNewGeographicTaxonomies, setOpenModalAddNewGeographicTaxonomies] =
    useState<boolean>(false);
  const [openModalFirstTimeAddGeographicTaxonomies, setOpenModalFirstTimeAddGeographicTaxonomies] =
    useState<boolean>(false);
  const [optionsSelected, setOptionsSelected] = useState<Array<GeographicTaxonomy>>(
    party.geographicTaxonomies ? party.geographicTaxonomies : [{ code: '', desc: '' }]
  );
  const [isAddNewAutocompleteEnabled, setIsAddNewAutocompleteEnabled] = useState<boolean>(false);
  const setPartyUpdated = (partyUpdated: Party) => {
    dispatch(partiesActions.setPartySelected(partyUpdated));
  };

  const partyUpdated = useAppSelector(partiesSelectors.selectPartySelected);
  useEffect(() => {
    if (ENV.GEOTAXONOMY.SHOW_GEOTAXONOMY && party.geographicTaxonomies.length === 0) {
      setOpenModalFirstTimeAddGeographicTaxonomies(true);
    }
    setOptionsSelected(
      party.geographicTaxonomies.length > 0 ? party.geographicTaxonomies : [{ code: '', desc: '' }]
    );
  }, [party]);

  useEffect(() => {}, [optionsSelected]);
  useEffect(() => {
    if (partyUpdated && party.partyId) {
      setPartyUpdated(partyUpdated);
    }
  }, [partyUpdated, party.partyId]);

  const infoStyles = {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.fontSize,
  };

  const institutionTypeTranscode = (institutionType: any) =>
    t(`overview.partyDetail.institutionTypeValue.${institutionType}`);
  const showTooltipAfter = 49;
  const isTaxCodeEquals2Piva = party.vatNumber === party.fiscalCode;
  const isInstitutionTypePA = party.institutionType === 'PA';

  const handleAddNewTaxonomies = () => {
    setLoadingSaveGeotaxonomies(true);
    DashboardApi.updateInstitutionGeographicTaxonomy(party.partyId, optionsSelected)
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
    <>
      <Grid container alignItems={'flex-start'} wrap="nowrap">
        <Grid container item xs={6} alignItems={'flex-start'} spacing={1} pr={2}>
          {/* institutionType */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.institutionType')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Tooltip
              title={
                institutionTypeTranscode(party.institutionType).length >= showTooltipAfter
                  ? institutionTypeTranscode(party.institutionType)
                  : ''
              }
              placement="top"
              arrow={true}
            >
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {institutionTypeTranscode(party.institutionType)}
              </Typography>
            </Tooltip>
          </Grid>
          {/* category */}
          {party.category && (
            <>
              <Grid item xs={4}>
                <Typography variant="body2" sx={{ ...labelStyles }}>
                  {t('overview.partyDetail.category')}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Tooltip
                  title={party.category.length >= showTooltipAfter ? party.category : ''}
                  placement="top"
                  arrow={true}
                >
                  <Typography
                    sx={{ ...infoStyles, maxWidth: '100% !important' }}
                    className="ShowDots"
                  >
                    {party.category}
                  </Typography>
                </Tooltip>
              </Grid>
            </>
          )}
          {/* geographicTaxonomy */}
          {ENV.GEOTAXONOMY.SHOW_GEOTAXONOMY && (
            <>
              <Grid item xs={4}>
                <Typography component="span" variant="body2" sx={{ ...labelStyles }}>
                  {t('overview.partyDetail.geographicTaxonomies.label')}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Tooltip
                  title={
                    partyUpdated && partyUpdated.description.length >= showTooltipAfter
                      ? partyUpdated.description
                      : ''
                  }
                  placement="top"
                  arrow={true}
                >
                  <Typography
                    sx={{ ...infoStyles, maxWidth: '100% !important', textTransform: 'capitalize' }}
                    className="ShowDots"
                    component="span"
                  >
                    {partyUpdated?.geographicTaxonomies[0]?.desc.toLocaleLowerCase() ?? '-'}
                    {partyUpdated && partyUpdated.geographicTaxonomies.length >= 1 && (
                      <>
                        {partyUpdated.geographicTaxonomies.length !== 1 ? ', ' : undefined}
                        <ButtonNaked
                          component="button"
                          onClick={() => setOpenModalAddNewGeographicTaxonomies(true)}
                          endIcon={<EditIcon />}
                          sx={{ color: 'primary.main', flexDirection: 'row' }}
                          weight="default"
                        >
                          {partyUpdated?.geographicTaxonomies.length !== 1
                            ? '+' + `${partyUpdated.geographicTaxonomies.length - 1}`
                            : undefined}
                        </ButtonNaked>
                      </>
                    )}
                  </Typography>
                </Tooltip>
              </Grid>
            </>
          )}
          {/* companyName */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.companyName')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Tooltip
              title={party.description.length >= showTooltipAfter ? party.description : ''}
              placement="top"
              arrow={true}
            >
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party.description}
              </Typography>
            </Tooltip>
          </Grid>
          {/* origin (ipa code) */}
          {isInstitutionTypePA && (
            <>
              <Grid item xs={4}>
                <Typography variant="body2" sx={{ ...labelStyles }}>
                  {t('overview.partyDetail.originId')}&nbsp;{party.origin}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Tooltip
                  title={party.originId.length >= showTooltipAfter ? party.originId : ''}
                  placement="top"
                  arrow={true}
                >
                  <Typography
                    sx={{ ...infoStyles, maxWidth: '100% !important' }}
                    className="ShowDots"
                  >
                    {party.originId}
                  </Typography>
                </Tooltip>
              </Grid>
            </>
          )}
          {(isInstitutionTypePA && !isTaxCodeEquals2Piva) || !isInstitutionTypePA ? (
            <>
              {/* fiscalCode */}
              <Grid item xs={4}>
                <Typography variant="body2" sx={{ ...labelStyles }}>
                  {isTaxCodeEquals2Piva
                    ? t('overview.partyDetail.isTaxCodeEquals2Piva')
                    : t('overview.partyDetail.fiscalCode')}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Tooltip
                  title={party.fiscalCode.length >= showTooltipAfter ? party.fiscalCode : ''}
                  placement="top"
                  arrow={true}
                >
                  <Typography
                    sx={{ ...infoStyles, maxWidth: '100% !important' }}
                    className="ShowDots"
                  >
                    {party.fiscalCode}
                  </Typography>
                </Tooltip>
              </Grid>
            </>
          ) : (
            <></>
          )}
          {/* vatNumberGroup */}
          {party.institutionType === 'PSP' && (
            <>
              <Grid item xs={4}>
                <Typography variant="body2" sx={{ ...labelStyles }}>
                  {t('overview.partyDetail.vatNumberGroup')}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  sx={{ ...infoStyles, maxWidth: '100% !important' }}
                  className="ShowDots"
                >
                  {party.vatNumberGroup === true
                    ? t('overview.partyDetail.vatNumberGroupValues.yes')
                    : t('overview.partyDetail.vatNumberGroupValues.no')}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
        <Grid container item xs={6} spacing={1}>
          {/* fiscalCode */}
          {isInstitutionTypePA && isTaxCodeEquals2Piva && (
            <>
              <Grid item xs={4}>
                <Typography variant="body2" sx={{ ...labelStyles }}>
                  {isTaxCodeEquals2Piva
                    ? t('overview.partyDetail.isTaxCodeEquals2Piva')
                    : t('overview.partyDetail.fiscalCode')}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Tooltip
                  title={party.fiscalCode.length >= showTooltipAfter ? party.fiscalCode : ''}
                  placement="top"
                  arrow={true}
                >
                  <Typography
                    sx={{ ...infoStyles, maxWidth: '100% !important' }}
                    className="ShowDots"
                  >
                    {party.fiscalCode}
                  </Typography>
                </Tooltip>
              </Grid>
            </>
          )}
          <>
            {/* vatNumber */}
            {!isTaxCodeEquals2Piva && (
              <>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ ...labelStyles }}>
                    {t('overview.partyDetail.vatNumber')}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Tooltip
                    title={
                      party.vatNumber && party.vatNumber.length >= showTooltipAfter
                        ? party.vatNumber
                        : ''
                    }
                    placement="top"
                    arrow={true}
                  >
                    <Typography
                      sx={{ ...infoStyles, maxWidth: '100% !important' }}
                      className="ShowDots"
                    >
                      {party?.vatNumber}
                    </Typography>
                  </Tooltip>
                </Grid>
              </>
            )}
          </>

          {/* pecEmail */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.pec')}
            </Typography>
          </Grid>
          <Grid item xs={8} sx={{}}>
            <Tooltip
              title={party.digitalAddress.length >= showTooltipAfter ? party.digitalAddress : ''}
              placement="top"
              arrow={true}
            >
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party.digitalAddress}
              </Typography>
            </Tooltip>
          </Grid>
          {/* registeredOffice  */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.registeredOffice')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Tooltip
              title={
                party.registeredOffice.length >= showTooltipAfter ? party.registeredOffice : ''
              }
              placement="top"
              arrow={true}
            >
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party.registeredOffice + ' - ' + party.zipCode}
              </Typography>
            </Tooltip>
          </Grid>
          {/* recipientCode */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.sdiCode')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.recipientCode}
            </Typography>
          </Grid>
          {/* supportEmail */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.supportEmail')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party?.supportEmail ? party.supportEmail : '-'}
            </Typography>
          </Grid>
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
