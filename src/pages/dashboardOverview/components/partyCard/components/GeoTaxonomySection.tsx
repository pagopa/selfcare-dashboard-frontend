import {
  Autocomplete,
  Box,
  FormControlLabel,
  RadioGroup,
  TextField,
  Radio,
  debounce,
  Grid,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { AddOutlined, RemoveCircleOutlineOutlined } from '@mui/icons-material';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { GeographicTaxonomy } from '../../../../../model/Party';
import { retrieveGeotaxonomyFromDescription } from '../../../../../services/partyRegistryProxyService';
import { nationalValue } from '../../../../../model/GeographicTaxonomy';

type Props = {
  geographicTaxonomies?: Array<GeographicTaxonomy>;
  notFoundAnyTaxonomies: boolean;
  setOptionsSelected: (os: Array<GeographicTaxonomy>) => void;
  setIsAddNewAutocompleteEnabled: (ae: boolean) => void;
  optionsSelected: Array<GeographicTaxonomy>;
  isAddNewAutocompleteEnabled: boolean;
};

export default function GeoTaxonomySection({
  geographicTaxonomies,
  notFoundAnyTaxonomies,
  setOptionsSelected,
  setIsAddNewAutocompleteEnabled,
  optionsSelected,
  isAddNewAutocompleteEnabled,
}: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();

  const [options, setOptions] = useState<Array<GeographicTaxonomy>>([]);
  const [isNationalAreaVisible, setIsNationalAreaVisible] = useState<boolean>(false);
  const [isLocalAreaVisible, setIsLocalAreaVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<any>({});
  const optionsSelectedRef = useRef<Array<GeographicTaxonomy>>();

  const emptyField = !optionsSelected.find((o) => o?.desc === '');

  const deleteError = (index: number) => {
    const newError = { ...error };
    // eslint-disable-next-line functional/immutable-data
    delete newError[index];
    setError(newError);
  };

  const findError = (index: number) => {
    setError((currError: any) => ({ ...currError, [index]: true }));
    setIsAddNewAutocompleteEnabled(false);
  };

  const handleChange = (_event: Event, value: string, index: number) => {
    const selectedArea = options.find((o) => o.desc === value);
    if (isLocalAreaVisible) {
      const newOccurencesSelected = [
        ...optionsSelected.filter((os) => os !== optionsSelected[index]),
        selectedArea ?? { code: '', desc: '' },
      ];
      setOptionsSelected(newOccurencesSelected);
      // eslint-disable-next-line functional/immutable-data
      optionsSelectedRef.current = newOccurencesSelected;
      setIsAddNewAutocompleteEnabled(true);
      if (emptyField && !optionsSelected) {
        setIsAddNewAutocompleteEnabled(false);
      }
    } else {
      deleteError(index);
      setIsAddNewAutocompleteEnabled(false);
    }
  };

  const handleAddClick = () => {
    if (emptyField) {
      setIsAddNewAutocompleteEnabled(false);
    }
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
        );

        setOptions(matchesWithTyped);

        if (matchesWithTyped.length > 0) {
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
    } else if (optionsSelectedRef.current) {
      setOptionsSelected(optionsSelectedRef.current);
      setIsAddNewAutocompleteEnabled(!!emptyField);
    }
  }, [isLocalAreaVisible]);

  return (
    <Grid>
      {notFoundAnyTaxonomies
        ? t(
            'overview.partyDetail.geographicTaxonomies.firstTimeInsertGeographicTaxonomiesModal.description'
          )
        : t(
            'overview.partyDetail.geographicTaxonomies.addNewGeographicTaxonomiesModal.description'
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
              setIsAddNewAutocompleteEnabled(true);
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
              if (geographicTaxonomies) {
                setOptionsSelected(optionsSelectedRef.current ?? geographicTaxonomies);
              }
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
                    options={input.length >= 3 ? options.map((o) => o.desc) : []}
                    sx={{ width: '100%' }}
                    onChange={(event: any, value: any) => handleChange(event, value, i)}
                    value={val?.desc}
                    renderOption={(props, option) => <span {...props}>{option ? option : ''}</span>}
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
