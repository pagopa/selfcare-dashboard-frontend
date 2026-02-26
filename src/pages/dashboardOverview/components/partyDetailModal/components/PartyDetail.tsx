/* eslint-disable complexity */ // TODO: remove eslint-disable complexity (add sub component)
import EditIcon from '@mui/icons-material/Edit';
import { Divider, Grid, Tooltip, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { usePermissions } from '@pagopa/selfcare-common-frontend';
import { Actions, PRODUCT_IDS } from '@pagopa/selfcare-common-frontend/utils/constants';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../../model/Party';
import { useAppSelector } from '../../../../../redux/hooks';
import { partiesSelectors } from '../../../../../redux/slices/partiesSlice';
import { ENV } from '../../../../../utils/env';
import { useCountries } from '../hooks/useCountries';
import { PartyDetailField } from './PartyDetailField';
import {
  capitalizeFirstLetter,
  getCountryNameByAlpha2,
  getIpaCodeForPa,
  getSimpleTooltipText,
  getStructureValue,
  getTooltipText,
} from './utils/partyUtils';

type Props = {
  party: Party;
  institutionTypesList: Array<string>;
  showGeoTaxonomyForInstitutionType: boolean;
  setOpenModalAddNewGeographicTaxonomies: (open: boolean) => void;
};

const labelStyles = {
  color: 'text.secondary',
  fontSize: '14px',
  fontweight: '400px',
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function PartyDetail({
  party,
  institutionTypesList,
  showGeoTaxonomyForInstitutionType,
  setOpenModalAddNewGeographicTaxonomies,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { hasPermission } = usePermissions();

  const partyUpdated = useAppSelector(partiesSelectors.selectPartySelected);

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

  const isAooUo = party.subunitType === 'AOO' || party.subunitType === 'UO';
  const isForeignInsurence = !!(party.country && party.country !== 'IT');

  const countries = useCountries(isForeignInsurence);

  const ipaCodeForPa = getIpaCodeForPa(party);

  const formattedForeignAddress = `${party.registeredOffice}, ${capitalizeFirstLetter(
    party.city
  )} ${getCountryNameByAlpha2(countries, party.country)}`;

  const canModifyGeographicTaxonomy = hasPermission(PRODUCT_IDS.PAGOPA, Actions.UpdateGeoTaxonomy);

  return (
    <Grid container spacing={1}>
      <Grid container item xs={12}>
        {/* companyName */}
        <PartyDetailField
          label={t(
            isAooUo ? 'overview.partyDetail.denomination' : 'overview.partyDetail.companyName'
          )}
          value={party.description}
          tooltipText={getSimpleTooltipText(party.description, showTooltipAfter)}
          showDivider={false}
        />

        {/* institutionType */}
        {uniqueInstitutionTypesList.length < 2 && (
          <PartyDetailField
            label={t('overview.partyDetail.institutionType')}
            value={institutionTypeTranscode(uniqueInstitutionTypesList[0])}
            tooltipText={getSimpleTooltipText(
              institutionTypeTranscode(uniqueInstitutionTypesList[0]),
              showTooltipAfter
            )}
          />
        )}

        {/* category */}
        {uniqueInstitutionTypesList.length < 2 && party.category && (
          <PartyDetailField
            label={t('overview.partyDetail.category')}
            value={party.category}
            tooltipText={getSimpleTooltipText(party.category, showTooltipAfter)}
          />
        )}

        {/* structure */}
        {isAooUo && (
          <PartyDetailField
            label={t('overview.partyDetail.structure')}
            value={getStructureValue(party.subunitType)}
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
                    title={getSimpleTooltipText(partyUpdated?.description, showTooltipAfter)}
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
                {canModifyGeographicTaxonomy &&
                  partyUpdated?.geographicTaxonomies &&
                  partyUpdated.geographicTaxonomies.length >= 1 && (
                    <ButtonNaked
                      component="button"
                      onClick={() => setOpenModalAddNewGeographicTaxonomies(true)}
                      endIcon={<EditIcon sx={{ height: '18px', width: '18px' }} />}
                      sx={{ color: 'primary.main', flexDirection: 'row' }}
                      weight="default"
                    >
                      {partyUpdated?.geographicTaxonomies.length === 1
                        ? undefined
                        : '+' + `${partyUpdated.geographicTaxonomies.length - 1}`}
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
            tooltipText={getSimpleTooltipText(ipaCodeForPa, showTooltipAfter)}
          />
        )}

        {/* uniqueCode for AOO/UO */}
        {isAooUo && (
          <PartyDetailField
            label={t('overview.partyDetail.uniqueCode')}
            value={party.subunitCode}
            tooltipText={getSimpleTooltipText(party.originId, showTooltipAfter)}
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
            tooltipText={getSimpleTooltipText(party.fiscalCode, showTooltipAfter)}
          />
        )}

        {/* vatNumberGroup */}
        {institutionTypesList?.includes('PSP') && (
          <PartyDetailField
            label={t('overview.partyDetail.vatNumberGroup')}
            value={
              party?.vatNumberGroup
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
            tooltipText={getSimpleTooltipText(party.fiscalCode, showTooltipAfter)}
          />
        )}

        {/* vatNumber */}
        {!isTaxCodeEquals2Piva && lastPartyVatNumber && (
          <PartyDetailField
            label={t('overview.partyDetail.vatNumber')}
            value={lastPartyVatNumber}
            tooltipText={getSimpleTooltipText(lastPartyVatNumber, showTooltipAfter)}
          />
        )}

        {/* pecEmail */}
        <PartyDetailField
          label={t('overview.partyDetail.pec')}
          value={party.digitalAddress}
          tooltipText={getSimpleTooltipText(party.digitalAddress, showTooltipAfter)}
        />

        {/* registeredOffice */}
        <PartyDetailField
          label={t('overview.partyDetail.registeredOffice')}
          value={
            isForeignInsurence
              ? formattedForeignAddress
              : party.zipCode
                ? `${party.registeredOffice} - ${party.zipCode} ${getCountryNameByAlpha2(
                  countries,
                  party.country
                )}`
                : `${party.registeredOffice} ${getCountryNameByAlpha2(countries, party.country)}`
          }
          tooltipText={getTooltipText(
            isForeignInsurence,
            formattedForeignAddress,
            `${party.registeredOffice} ${getCountryNameByAlpha2(countries, party.country)}`,
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
  );
}
