import { Autocomplete, Box, FormControlLabel, RadioGroup, TextField, Radio } from '@mui/material';
import { useEffect, useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { AddOutlined, RemoveCircleOutlineOutlined } from '@mui/icons-material';
import { GeographicTaxonomy } from '../../../../../model/Party';

export const options = [
  { code: '058091', desc: 'Roma - Comune' },
  { code: '015146', desc: 'Milano - Comune' },
];
type Props = {
  geographicTaxonomies: Array<{
    code: string;
    desc: string;
  }>;
};

export default function GeotaxonomySection({ geographicTaxonomies }: Props) {
  const [optionsSelected, setOptionsSelected] = useState<Array<GeographicTaxonomy>>(
    geographicTaxonomies ?? { code: '', desc: '' }
  );
  const [isNationalAreaVisible, setIsNationalAreaVisible] = useState<boolean>(false);
  const [isLocalAreaVisible, setIsLocalAreaVisible] = useState<boolean>(false);
  const [isAddNewAutocompleteEnabled, setIsAddNewAutocompleteEnabled] = useState<boolean>(false);

  const [input, setInput] = useState<string>('');

  const [error, setError] = useState<any>({});

  const { t } = useTranslation();

  const deleteError = (index: number) => {
    const newError = { ...error };
    // eslint-disable-next-line functional/immutable-data
    delete newError[index];
    setError(newError);
  };

  const findError = (index: number, data: any) => {
    if (data?.length === 0) {
      setError((currError: any) => ({ ...currError, [index]: true }));
    } else {
      deleteError(index);
    }
  };

  console.log(findError); // TODO: remove when real api will be ready

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
  };

  const handleSearchInput = (event: any, _index: number) => {
    const value = event.target.value;
    setInput(value);
    // if (value.length >= 3) {
    //   void debounce(handleSearch, 100)(value, index);
    // } else {
    //   setOptions([]);
    // }
  };

  //   const handleSearch = async (query: string, index: number) => {
  //     setIsLoading(true);
  //     const searchGeotaxonomy = await fetchWithLogs(
  //       {
  //         endpoint: 'ONBOARDING_GET_GEOTAXONOMY',
  //       },
  //       {
  //         method: 'GET',
  //         params: { limit: ENV.MAX_INSTITUTIONS_FETCH, page: 1, startsWith: query },
  //       },
  //       () => setRequiredLogin(true)
  //     );
  //     const outcome = getFetchOutcome(searchGeotaxonomy);

  //     if (outcome === 'success') {
  //       // eslint-disable-next-line functional/no-let
  //       let data = (searchGeotaxonomy as AxiosResponse).data;

  //       data = data.map((value: OnboardingInstitutionInfo) => ({ ...value, label: value.desc }));

  //       if (optionsSelected?.find((os) => os?.desc)) {
  //         const dataFiltered = data.filter(
  //           (data: any) => !optionsSelected.find((os) => os?.code === data?.code)
  //         );
  //         findError(index, dataFiltered);
  //         setOptions(dataFiltered);
  //       } else {
  //         setOptions(data);
  //         findError(index, data);
  //       }
  //     } else if ((searchGeotaxonomy as AxiosError).response?.status === 404) {
  //       setOptions([]);
  //     }
  //     setIsLoading(false);
  //   };

  useEffect(() => {
    if (geographicTaxonomies && geographicTaxonomies[0]?.code === '100') {
      setIsNationalAreaVisible(true);
      setOptionsSelected([{ code: '100', desc: 'ITALIA' }]);
    } else if (geographicTaxonomies && geographicTaxonomies.length > 0) {
      setIsLocalAreaVisible(true);
      setOptionsSelected(geographicTaxonomies);
      setIsAddNewAutocompleteEnabled(true);
    }
  }, []);
  return (
    <>
      {t('overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.description')}
      <RadioGroup name="geographicTaxonomy">
        <Box display="flex">
          <FormControlLabel
            checked={isNationalAreaVisible}
            value={'nationl'}
            control={<Radio disableRipple={true} />}
            label={t(
              'overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.national'
            )}
            onChange={() => {
              setIsNationalAreaVisible(true);
              setIsLocalAreaVisible(false);
              setOptionsSelected([{ code: '100', desc: 'ITALIA' }]);
            }}
            sx={{ mr: 3, ml: 1 }}
          />
          <FormControlLabel
            id={'geographicTaxonomies'}
            checked={isLocalAreaVisible}
            value={'local'}
            control={<Radio disableRipple={true} />}
            label={t('overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.local')}
            onChange={() => {
              setIsNationalAreaVisible(false);
              setIsLocalAreaVisible(true);
              setOptionsSelected(optionsSelected);
              if (geographicTaxonomies && geographicTaxonomies[0].code !== '100') {
                setOptionsSelected(geographicTaxonomies);
              } else {
                setOptionsSelected([{ code: '', desc: '' }]);
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
                    // onOpen={() => setOptions([])}
                    disablePortal
                    options={input.length >= 3 ? options : []}
                    sx={{ width: '100%' }}
                    onChange={(event: any, value: any) => handleChange(event, value, i)}
                    value={val?.desc}
                    renderOption={(props, option) => (
                      // TODO: customize layout
                      <span {...props}>{option.desc ? option.desc : ''}</span>
                    )}
                    renderInput={(params) => (
                      <TextField
                        onChange={(e) => handleSearchInput(e, i)}
                        {...params}
                        variant="outlined"
                        label={
                          !optionsSelected?.[i]?.desc
                            ? t(
                                'overview.partyDetail.geographicTaxonomies.geographicTaxonomiesModal.inputLabel'
                              )
                            : ''
                        }
                        error={error?.[i]}
                        helperText={
                          error?.[i] && t('onboardingFormData.taxonomySection.error.notMatchedArea')
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
  );
}
