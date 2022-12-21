import {
  Autocomplete,
  Box,
  FormControlLabel,
  Grid,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Radio,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { SessionModal } from '@pagopa/selfcare-common-frontend';
import { AddOutlined, RemoveCircleOutlineOutlined } from '@mui/icons-material';
import { GeographicTaxonomy, Party } from '../../../../../model/Party';

type Props = {
  party: Party;
};
const labelStyles = {
  color: 'text.colorTextPrimary',
};

export default function PartyDetail({ party }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [openModalGeographicTaxonomies, setOpenModalGeographicTaxonomies] =
    useState<boolean>(false);

  // const [options, setOptions] = useState<Array<OnboardingInstitutionInfo>>([]);
  const [optionsSelected, setOptionsSelected] = useState<Array<GeographicTaxonomy>>([
    { code: '', desc: '' },
  ]);
  const [isNationalAreaVisible, setIsNationalAreaVisible] = useState<boolean>(false);
  const [isLocalAreaVisible, setIsLocalAreaVisible] = useState<boolean>(false);
  const [isAddNewAutocompleteEnabled, setIsAddNewAutocompleteEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (party.geographicTaxonomies.length === 0) {
      setOpenModalGeographicTaxonomies(true);
    }
  }, []);

  const notValidEntry = false; // input.length >= 3 && options.length === 0;

  const infoStyles = {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.fontSize,
  };

  const institutionTypeTranscode = (institutionType: any) =>
    t(`overview.partyDetail.institutionTypeValue.${institutionType}`);
  const showTooltipAfter = 49;

  const handleRemoveClick = (index: number) => {
    const list = [...optionsSelected];
    // eslint-disable-next-line functional/immutable-data
    list.splice(index, 1);
    setOptionsSelected(list);
    setIsAddNewAutocompleteEnabled(true);
  };

  const handleAddClick = () => {
    setOptionsSelected([
      ...optionsSelected,
      {
        code: '',
        desc: '',
      },
    ]);
  };

  const handleChange = (_event: any, value: any, index: number) => {
    const newValues = optionsSelected;
    const emptyField = !optionsSelected.find((o) => o?.desc === '');

    // eslint-disable-next-line functional/immutable-data
    newValues[index] = value;
    setOptionsSelected(newValues);
    if (newValues[index]?.desc || emptyField) {
      setIsAddNewAutocompleteEnabled(true);
    }
  };

  const handleAddNewTaxonomies = () => {
    // TODO Add the new API for modify/add new taxonomies
    setOpenModalGeographicTaxonomies(false);
  };

  const options = [
    { code: '323435435', desc: 'Comune di Monza' },
    { code: '43543546', desc: 'Comune di Napoli' },
    { code: '65655665', desc: 'Comune di Roma' },
  ];

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
          {/* Categoria */}
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
          {/* area di competenza */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.geographicTaxonomies.label')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Tooltip
              title={party.description.length >= showTooltipAfter ? party.description : ''}
              placement="top"
              arrow={true}
            >
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party.geographicTaxonomies[0]?.desc}
                {party.geographicTaxonomies.length > 1 ? (
                  <>
                    {', '}
                    <ButtonNaked
                      component="button"
                      onClick={() => setOpenModalGeographicTaxonomies(true)}
                      endIcon={<EditIcon />}
                      sx={{ color: 'primary.main', flexDirection: 'row' }}
                      weight="default"
                    >
                      {'+'}
                      {party.geographicTaxonomies.length - 1}
                    </ButtonNaked>
                  </>
                ) : (
                  <ButtonNaked
                    component="button"
                    onClick={() => setOpenModalGeographicTaxonomies(true)}
                    endIcon={<EditIcon />}
                    sx={{ color: 'primary.main', flexDirection: 'row' }}
                    weight="default"
                  />
                )}
              </Typography>
            </Tooltip>
          </Grid>
          {/* ragione sociale */}
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
          {/* origin */}
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
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party.originId}
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container item xs={6} spacing={1}>
          {/* codice fiscale */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.fiscalCode')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Tooltip
              title={party.fiscalCode.length >= showTooltipAfter ? party.fiscalCode : ''}
              placement="top"
              arrow={true}
            >
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party.fiscalCode}
              </Typography>
            </Tooltip>
          </Grid>
          {/* indirizzo PEC primario */}
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
          {/* sede legale  */}
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
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...labelStyles }}>
              {t('overview.partyDetail.recipientCode')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.recipientCode}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <SessionModal
        open={openModalGeographicTaxonomies}
        title={t('overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.title')}
        message={
          <>
            {t('overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.description')}
            <RadioGroup name="geographicTaxonomy">
              <Box display="flex" mt={3}>
                <FormControlLabel
                  checked={isNationalAreaVisible}
                  value="national"
                  control={<Radio disableRipple={true} />}
                  label={t(
                    'overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.national'
                  )}
                  onChange={() => {
                    setIsNationalAreaVisible(true);
                    setIsLocalAreaVisible(false);
                  }}
                  sx={{ mr: 3, ml: 1 }}
                />
                <FormControlLabel
                  checked={isLocalAreaVisible}
                  value="local"
                  control={<Radio disableRipple={true} />}
                  label={t(
                    'overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.local'
                  )}
                  onChange={() => {
                    setIsNationalAreaVisible(false);
                    setIsLocalAreaVisible(true);
                  }}
                />
              </Box>
            </RadioGroup>
            {isLocalAreaVisible && (
              <>
                {optionsSelected.map((val, i) => (
                  <div key={i}>
                    <Box display={'flex'} width="100%" mt={2}>
                      {i !== 0 && (
                        <Box display="flex" alignItems={'center'}>
                          <ButtonNaked
                            component="button"
                            onClick={() => handleRemoveClick(i)}
                            startIcon={<RemoveCircleOutlineOutlined />}
                            sx={{ color: 'error.dark', size: 'medium' }}
                            weight="default"
                            size="large"
                          />
                        </Box>
                      )}
                      <Box width="100%">
                        <Autocomplete
                          id="taxonomies"
                          freeSolo
                          disablePortal
                          options={options}
                          sx={{ width: '100%' }}
                          onChange={(event: any, value: any) => handleChange(event, value, i)}
                          value={val?.desc}
                          renderOption={(props, option) => (
                            <span {...props}>{option.desc ? option.desc : ''}</span>
                          )}
                          renderInput={(params) => (
                            <TextField
                              // onChange={handleSearchInput}
                              {...params}
                              variant="outlined"
                              label={
                                !optionsSelected?.[i]?.desc
                                  ? t(
                                      'overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.inputLabel'
                                    )
                                  : ''
                              }
                              error={notValidEntry}
                            />
                          )}
                        />
                        {notValidEntry && (
                          <Typography
                            sx={{ fontSize: 'fontSize', color: 'error.dark' }}
                            pt={1}
                            ml={2}
                          >
                            {t(
                              'overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.error.notMatchedArea'
                            )}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {optionsSelected.length - 1 === i && (
                      <Box mt={2}>
                        <ButtonNaked
                          disabled={!isAddNewAutocompleteEnabled}
                          component="button"
                          onClick={handleAddClick}
                          startIcon={<AddOutlined />}
                          sx={{ color: 'primary.main' }}
                          weight="default"
                        >
                          {t(
                            'overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.addMoreArea'
                          )}
                        </ButtonNaked>
                      </Box>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        }
        onConfirmLabel={t(
          'overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.modify'
        )}
        onCloseLabel={t('overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.back')}
        onConfirm={() => handleAddNewTaxonomies()}
        handleClose={() => {
          setOpenModalGeographicTaxonomies(false);
        }}
      />
    </>
  );
}
