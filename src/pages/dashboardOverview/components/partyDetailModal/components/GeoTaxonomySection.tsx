import { AddOutlined, RemoveCircleOutlineOutlined } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  debounce,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { GeographicTaxonomyResource } from '../../../../../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { nationalValue } from '../../../../../model/GeographicTaxonomy';
import { retrieveGeotaxonomyFromDescription } from '../../../../../services/partyRegistryProxyService';

type Error = {
  [index: number]: boolean;
};

type Props = {
  geographicTaxonomies?: Array<GeographicTaxonomyResource>;
  notFoundAnyTaxonomies: boolean;
  setOptionsSelected: (os: Array<GeographicTaxonomyResource>) => void;
  setIsAddNewAutocompleteEnabled: (ae: boolean) => void;
  optionsSelected: Array<GeographicTaxonomyResource>;
  isAddNewAutocompleteEnabled: boolean;
};

export default function GeoTaxonomySection({
  geographicTaxonomies,
  notFoundAnyTaxonomies,
  setOptionsSelected,
  setIsAddNewAutocompleteEnabled,
  optionsSelected,
  isAddNewAutocompleteEnabled,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();

  const [options, setOptions] = useState<Array<GeographicTaxonomyResource>>([]);
  const [isNationalAreaVisible, setIsNationalAreaVisible] = useState<boolean>(false);
  const [isLocalAreaVisible, setIsLocalAreaVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<Error>();

  const [localOptionsSelected, setLocalOptionsSelected] = useState<
    Array<GeographicTaxonomyResource>
  >([{ code: '', desc: '' }]);

  useEffect(() => {
    const emptyField = !optionsSelected.find((o) => o?.desc === '');

    setIsAddNewAutocompleteEnabled(emptyField);
  }, [optionsSelected]);

  const deleteError = (index: number) => {
    setError((currError) => ({ ...currError, [index]: false }));
  };

  const findError = (index: number) => {
    setError((currError) => ({ ...currError, [index]: true }));
    setIsAddNewAutocompleteEnabled(false);
  };

  const handleChange = (_event: Event, value: string, reason: string, index: number) => {
    const selectedArea = options.find((o) => o.desc === value);
    if (isLocalAreaVisible && reason !== 'clear') {
      const updatedOptionsSelected = optionsSelected.map((os, currentIndex) =>
        currentIndex === index ? selectedArea ?? { code: '', desc: '' } : os
      );
      setOptionsSelected(updatedOptionsSelected);
      setIsAddNewAutocompleteEnabled(true);
    } else {
      deleteError(index);
      setIsAddNewAutocompleteEnabled(false);
    }
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

  const handleRemoveClick = (index: number) => {
    const list = [...optionsSelected];
    // eslint-disable-next-line functional/immutable-data
    list.splice(index, 1);
    setOptionsSelected(list);
    setIsAddNewAutocompleteEnabled(true);
    deleteError(index);
  };

  const handleSearchInput = (event: Event, index: number) => {
    const typedValue = (event as any)?.target.value;
    setInput(typedValue);
    if (typedValue.length >= 3) {
      void debounce(handleSearch, 100)(typedValue, index);
    } else {
      deleteError(index);
      setIsAddNewAutocompleteEnabled(false);
    }
  };
  const handleSearch = async (query: string, index: number) => {
    await retrieveGeotaxonomyFromDescription(query)
      .then((gt) => {
        const availableGeographicAreas = gt.filter(
          (ga) => !optionsSelected.find((os) => os.desc === ga.desc)
        );
        const matchesWithTyped = availableGeographicAreas.filter((o) =>
          o.desc?.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        ) as Array<GeographicTaxonomyResource>;

        setOptions(matchesWithTyped);

        if (matchesWithTyped.length > 0 || query === '') {
          deleteError(index);
        } else {
          findError(index);
          setIsAddNewAutocompleteEnabled(false);
        }
      })
      .catch((reason) => {
        addError({
          id: 'UNSUCCESS_RETRIEVE_GEOTAXONOMIES',
          blocking: false,
          techDescription: `An error occured while retrieving geotaxonomies`,
          toNotify: false,
          error: reason,
        });
      });
  };

  useEffect(() => {
    if (geographicTaxonomies && geographicTaxonomies[0]?.code === nationalValue) {
      setIsNationalAreaVisible(true);
      setOptionsSelected([{ code: nationalValue, desc: 'ITALIA' }]);
    } else if (geographicTaxonomies && geographicTaxonomies.length > 0) {
      setIsLocalAreaVisible(true);
      setOptionsSelected(geographicTaxonomies);
      setIsAddNewAutocompleteEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (isLocalAreaVisible && optionsSelected.length === 0) {
      setOptionsSelected([{ code: '', desc: '' }]);
      setIsAddNewAutocompleteEnabled(false);
    }
  }, [isLocalAreaVisible]);

  return (
    <Grid>
      {notFoundAnyTaxonomies ? (
        <Trans
          i18nKey="overview.partyDetail.geographicTaxonomies.firstTimeInsertGeographicTaxonomiesModal.description"
          components={[<br key="br" />]}
        />
      ) : (
        t('overview.partyDetail.geographicTaxonomies.addNewGeographicTaxonomiesModal.description')
      )}
      <RadioGroup name="geographicTaxonomy">
        <Box display="flex" mt={4}>
          <FormControlLabel
            checked={isNationalAreaVisible}
            value={'national'}
            control={<Radio disableRipple={true} />}
            label={t('overview.partyDetail.geographicTaxonomies.modalSections.national')}
            onChange={() => {
              setIsNationalAreaVisible(true);
              setIsLocalAreaVisible(false);
              setError(undefined);
              setIsAddNewAutocompleteEnabled(true);
              setLocalOptionsSelected(optionsSelected);
              setOptionsSelected([{ code: nationalValue, desc: 'ITALIA' }]);
            }}
            sx={{ mr: 3, ml: 1 }}
          />
          <FormControlLabel
            id={'geographicTaxonomies'}
            checked={isLocalAreaVisible}
            value={'local'}
            control={<Radio disableRipple={true} />}
            label={t('overview.partyDetail.geographicTaxonomies.modalSections.local')}
            onChange={() => {
              setIsNationalAreaVisible(false);
              setIsLocalAreaVisible(true);
              setIsAddNewAutocompleteEnabled(true);
              setOptionsSelected(localOptionsSelected);
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
                    freeSolo
                    onOpen={() => setOptions([])}
                    disablePortal
                    options={input.length >= 3 ? options?.map((o) => o.desc) : []}
                    sx={{
                      width: '100%',
                      '& .MuiAutocomplete-inputRoot .MuiAutocomplete-input': {
                        textTransform: 'capitalize',
                      },
                    }}
                    onChange={(event: any, value: any, reason) =>
                      handleChange(event, value, reason, i)
                    }
                    value={val?.desc?.toLowerCase()}
                    renderOption={(props, option) => (
                      <span style={{ textTransform: 'capitalize' }} {...props}>
                        {option ? option.toLocaleLowerCase() : ''}
                      </span>
                    )}
                    renderInput={(params) => (
                      <TextField
                        onChange={(e: any) => handleSearchInput(e, i)}
                        {...params}
                        variant="outlined"
                        label={t(
                          'overview.partyDetail.geographicTaxonomies.modalSections.inputLabel'
                        )}
                        error={error?.[i]}
                        helperText={
                          error?.[i] &&
                          t(
                            'overview.partyDetail.geographicTaxonomies.modalSections.error.notMatchedArea'
                          )
                        }
                      />
                    )}
                  />
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
                    {t('overview.partyDetail.geographicTaxonomies.modalSections.addMoreArea')}
                  </ButtonNaked>
                </Box>
              )}
            </div>
          ))}
        </>
      )}
    </Grid>
  );
}
