import { Grid, Tooltip, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { Party } from '../../../../../model/Party';
import { ENV } from '../../../../../utils/env';

type Props = {
  party: Party;
  infoStyles: any;
  labelStyles: any;
  institutionTypeTranscode: (institutionType: any) => string;
  showTooltipAfter: number;
  partyUpdated?: Party;
  setOpenModalAddNewGeographicTaxonomies: Dispatch<SetStateAction<boolean>>;
};

export default function AooUoSection({
  party,
  labelStyles,
  infoStyles,
  institutionTypeTranscode,
  showTooltipAfter,
  partyUpdated,
  setOpenModalAddNewGeographicTaxonomies,
}: Props) {
  const { t } = useTranslation();
  // const isAoo = party.aoo.length > 0;
  // const isUo = party.uo.length > 0;

  const isAoo = false;
  const isUo = true;

  return (
    <Grid container alignItems={'flex-start'} wrap="nowrap">
      <Grid container item xs={6} alignItems={'flex-start'} spacing={1} pr={2}>
        <>
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
        </>
        <>
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
        </>

        <>
          <Grid item xs={4}>
            STRUTTURA
          </Grid>
          <Grid item xs={8}>
            {isAoo ? 'struttura Aoo' : isUo ? 'struttura Uo' : ''}
          </Grid>
        </>
        <>
          <Grid item xs={4}>
            DENOMINAZIONE
          </Grid>
          <Grid item xs={8}>
            denominazione
          </Grid>
        </>
        <>
          <Grid item xs={4}>
            CODICE UNIVOCO
          </Grid>
          <Grid item xs={8}>
            codice univoco aoo/uo
          </Grid>
        </>
        <>
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
                    sx={{
                      ...infoStyles,
                      maxWidth: '100% !important',
                      textTransform: 'capitalize',
                    }}
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
        </>
      </Grid>
      <Grid container item xs={6} spacing={1}>
        <>
          <Grid item xs={4}>
            CODICE FISCALE
          </Grid>
          <Grid item xs={8}>
            codice fiscale ente
          </Grid>
        </>
        <>
          <Grid item xs={4}>
            INDIRIZZO PEC PRIMARIO
          </Grid>
          <Grid item xs={8}>
            indirizzo pec primario
          </Grid>
        </>
        <>
          <Grid item xs={4}>
            SEDE LEGALE
          </Grid>
          <Grid item xs={8}>
            sede legale
          </Grid>
        </>
        {/* SOLO SE UO TODO: party.uo */}
        <>
          <Grid item xs={4}>
            AOO DI RIFERIMENTO{' '}
          </Grid>
          <Grid item xs={8}>
            aoo di riferimento -- solo per uo
          </Grid>
        </>
        {/*  */}
        <>
          <Grid item xs={4}>
            CODICE SDI
          </Grid>
          <Grid item xs={8}>
            codice sdi
          </Grid>
        </>
      </Grid>
    </Grid>
  );
}
