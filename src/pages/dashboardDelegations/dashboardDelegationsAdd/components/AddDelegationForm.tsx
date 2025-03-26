import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  TitleBox,
  useErrorDispatcher,
  useLoading,
  useUnloadEventOnExit,
  useUserNotify,
} from '@pagopa/selfcare-common-frontend/lib';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BrokerResource } from '../../../../api/generated/b4f-dashboard/BrokerResource';
import { DelegationResource } from '../../../../api/generated/b4f-dashboard/DelegationResource';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { fetchDelegations } from '../../../../services/delegationServices';
import { createDelegation, getProductBrokers } from '../../../../services/partyService';
import { LOADING_TASK_DELEGATION_FORM } from '../../../../utils/constants';
import CustomListBoxComponent from './CustomListBoxComponent';

type Props = {
  productsWithCreateDelegationAction: Array<Product>;
  party: Party;
  selectedProductByQuery?: Product;
};

export default function AddDelegationForm({
  productsWithCreateDelegationAction,
  party,
  selectedProductByQuery,
}: Readonly<Props>) {
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();
  const setLoading = useLoading(LOADING_TASK_DELEGATION_FORM);

  const [productSelected, setProductSelected] = useState<Product>();
  const [productBrokers, setProductBrokers] = useState<Array<BrokerResource>>();
  const [techPartnerSelected, setTechPartnerSelected] = useState<BrokerResource>();
  const [delegationsList, setDelegationsList] = useState<Array<DelegationResource>>();
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>('institutionName');
  const [inputValue, setInputValue] = useState<string>('');
  const delegationsListRef = useRef(delegationsList);

  useEffect(() => {
    if (productsWithCreateDelegationAction.length === 1) {
      setProductSelected(productsWithCreateDelegationAction[0]);
    }
  }, [productsWithCreateDelegationAction]);

  useEffect(() => {
    if (selectedProductByQuery) {
      const chosenProduct = productsWithCreateDelegationAction.find(
        (dp) => dp.id === selectedProductByQuery.id
      );
      setProductSelected(chosenProduct);
    }
  }, [selectedProductByQuery]);

  const retrieveDelegationsList = async () => {
    setLoading(true);
    await fetchDelegations(party.partyId)
      .then((r) => {
        setDelegationsList(r);
        /* eslint-disable functional/immutable-data */
        delegationsListRef.current = r;
      })
      .catch((reason) => {
        addError({
          id: `FETCH_PARTY_DELEGATIONS_ERROR-${party.partyId}`,
          blocking: true,
          component: 'SessionModal',
          error: reason,
          techDescription: `Something gone wrong while fetching delegations with party id ${party.partyId}`,
          displayableTitle: t('overview.genericError.title'),
          displayableDescription: (
            <Trans i18nKey="overview.genericError.description">
              A causa di un errore del sistema non è possibile completare la procedura.
              <br />
              Ti chiediamo di riprovare più tardi.
            </Trans>
          ),
          toNotify: true,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void retrieveDelegationsList();
  }, []);

  useEffect(() => {
    if (productSelected && delegationsListRef) {
      handleProductBrokers(productSelected.id, party.institutionType as string);
    }
  }, [productSelected]);

  const handleProductBrokers = (productId: string, institutionType: string) => {
    setLoading(true);
    getProductBrokers(productId, institutionType)
      .then((pb) => {
        const orderedProductBrokers = [...pb].sort(
          (firstBroker: BrokerResource, secondBroker: BrokerResource) => {
            const regexp = /[_"'.,;-]+/g;
            const firstBrokerName = firstBroker.description?.replace(regexp, '');
            const secondBrokerName = secondBroker.description?.replace(regexp, '');
            if (firstBrokerName && secondBrokerName) {
              return firstBrokerName.localeCompare(secondBrokerName);
            } else {
              return 0;
            }
          }
        );
        const delegable4ProductBrokers = orderedProductBrokers.filter(
          (ob) =>
            !delegationsListRef?.current?.some(
              (dl) => dl.productId === productId && dl.brokerName === ob.description
            )
        );

        setProductBrokers(delegable4ProductBrokers);
      })
      .catch((reason) => {
        addError({
          id: 'PRODUCT_BROKERS_NOT_FOUND',
          blocking: false,
          toNotify: false,
          error: reason,
          techDescription: `Cannot find product brokers for product: ${productId} and institution type: ${institutionType}`,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    if (productSelected && techPartnerSelected) {
      setLoading(true);
      createDelegation(party, productSelected, techPartnerSelected)
        .then(() => {
          addNotify({
            component: 'Toast',
            id: 'DELEGATION_CREATED_SUCCESSFULLY',
            title: t('addDelegationPage.delegationSuccessfulCreated'),
            message: '',
          });
          history.push(
            resolvePathVariables(DASHBOARD_ROUTES.DELEGATIONS.path, { partyId: party.partyId })
          );
        })
        .catch((reason) => {
          const alreadyDelegated = reason.httpStatus === 409;
          addError({
            id: 'DELEGATION_NOT_CREATED',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while creating delegation for ${party.partyId}`,
            toNotify: true,
            displayableTitle: alreadyDelegated
              ? t('addDelegationPage.alreadyDelegated')
              : t('addDelegationPage.delegationNotCreated'),
            displayableDescription: '',
            component: 'Toast',
          });
        })
        .finally(() => setLoading(false));
    }
  };
  const confirmAddDelegateModal = () => {
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: t('addDelegationPage.confirmModal.title'),
      message: (
        <Trans
          i18nKey="addDelegationPage.confirmModal.description"
          values={{
            productName: productSelected?.title,
            institutionName: party.description,
            partnerName: techPartnerSelected?.description,
          }}
          components={{
            1: <strong />,
            2: <strong />,
            3: <strong />,
            4: <br />,
          }}
        >
          {`Delegando la gestione del prodotto <1>{{productName}}</1> per l’ente <2>{{institutionName}}</2> a <3>{{partnerName}}</3>.<4/> Se confermi, {{partnerName}} potrà gestire il prodotto per conto del tuo ente.`}
        </Trans>
      ),
      confirmLabel: t('addDelegationPage.confirmModal.confirmButton'),
      closeLabel: t('addDelegationPage.confirmModal.backButton'),
      onConfirm: () => handleSubmit(),
    });
  };
  return (
    <>
      <Grid container sx={{ backgroundColor: 'background.paper' }} p={3}>
        <Grid item xs={12} mb={3}>
          <Typography variant="h6" sx={{ fontWeight: 'fontWeightBold' }} mb={2}>
            {t('addDelegationPage.addOneDelegation')}
          </Typography>
          <Typography variant="body1">{t('addDelegationPage.formSubTitle')}</Typography>
          {
            <Link
              href={
                'https://docs.pagopa.it/area-riservata/area-riservata/come-funziona/come-delegare-la-gestione'
              }
              target="_blank"
              sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '14px' }}
              mt={1}
            >
              {t('addDelegationPage.findOutMore')}
            </Link>
          }
        </Grid>
        <Grid item xs={6} mb={3}>
          <Typography variant="subtitle1" fontSize={'16px'} mb={2}>
            {t('addDelegationPage.chooseProduct')}
          </Typography>
          <FormControl fullWidth>
            <InputLabel
              id="select-product-label"
              size="small"
              sx={{
                '.MuiInputLabel-root.Mui-focused': {
                  color: 'text.primary',
                  fontWeight: 'fontWeightBold',
                },
              }}
            >
              {t('addDelegationPage.chooseProduct')}
            </InputLabel>
            <Select
              id="select-product-choose"
              size="small"
              disabled={productsWithCreateDelegationAction.length === 1 || !!selectedProductByQuery}
              fullWidth
              value={productSelected ? productSelected?.title : ''}
              displayEmpty
              variant="outlined"
              labelId="select-label-products"
              label={t('addDelegationPage.chooseProduct')}
              input={<OutlinedInput label={t('addDelegationPage.chooseProduct')} />}
              renderValue={(productSelected) => (
                <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                  {productSelected}
                </Typography>
              )}
            >
              {productsWithCreateDelegationAction.map((p: Product, index) => (
                <MenuItem
                  key={index}
                  value={p.title}
                  sx={{ fontSize: '14px', color: '#000000' }}
                  onClick={() => setProductSelected(p)}
                >
                  {p.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TitleBox
            title={t('addDelegationPage.selectTechPartner.title')}
            subTitle={t('addDelegationPage.selectTechPartner.subTitle')}
            mbTitle={1}
            mbSubTitle={2}
            titleFontSize="16px"
            subTitleFontSize="16px"
            variantTitle="subtitle1"
            variantSubTitle="body2"
          />
        </Grid>
        <Grid>
          <RadioGroup
            row
            name="techPartnerRadio"
            value={selectedRadioValue}
            onChange={(_e, selectedValue: string) => {
              setSelectedRadioValue(selectedValue);
            }}
            sx={{ marginBottom: 1 }}
            defaultValue={selectedRadioValue}
          >
            <FormControlLabel
              control={<Radio />}
              label={t('addDelegationPage.selectTechPartner.radioName')}
              value={'institutionName'}
            ></FormControlLabel>
            <FormControlLabel
              control={<Radio />}
              label={t('addDelegationPage.selectTechPartner.radioFiscalCode')}
              value={'fiscalCode'}
            ></FormControlLabel>
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Autocomplete
              // TODO 'NAME' label hidden for searchbyname until Intermediated entities data is avaible
              options={productBrokers ?? []}
              getOptionLabel={(option) => option.description ?? ''}
              clearOnEscape
              onChange={(_e, selectedPb: any) => {
                setTechPartnerSelected(selectedPb);
              }}
              onInputChange={(_e, inputValue) => {
                setInputValue(inputValue);
              }}
              sx={{
                '.MuiOutlinedInput-root.MuiInputBase-root.MuiInputBase-adornedEnd.MuiAutocomplete-inputRoot':
                  {
                    paddingRight: 2,
                  },
              }}
              ListboxProps={{
                style: {
                  overflow: 'visible',
                },
              }}
              filterOptions={(productBrokers, { inputValue }) => {
                if (selectedRadioValue === 'fiscalCode' && inputValue.length === 11) {
                  return productBrokers.filter((productBrokers) =>
                    productBrokers?.code?.toLowerCase().includes(inputValue.toLowerCase())
                  );
                } else if (selectedRadioValue === 'institutionName') {
                  return productBrokers.filter((productBrokers) =>
                    productBrokers?.description?.toLowerCase().includes(inputValue.toLowerCase())
                  );
                } else {
                  return [];
                }
              }}
              componentsProps={{
                paper: {
                  sx: {
                    '&::-webkit-scrollbar': {
                      width: 4,
                    },
                    '&::-webkit-scrollbar-track': {
                      boxShadow: `inset 10px 10px  #E6E9F2`,
                      marginY: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#0073E6',
                      borderRadius: '16px',
                    },
                    overflowY: 'auto',
                    maxHeight: '200px',
                    '.MuiAutocomplete-noOptions': () => ({
                      display:
                        (selectedRadioValue === 'fiscalCode' && !inputValue.length) ||
                        techPartnerSelected
                          ? 'none'
                          : 'block',
                    }),
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  sx={{
                    '.MuiInputLabel-root.Mui-focused': {
                      color: 'primary.main',
                      fontWeight: 'fontWeightMedium',
                    },
                  }}
                  {...params}
                  label={
                    selectedRadioValue === 'fiscalCode'
                      ? t('addDelegationPage.selectTechPartner.labelFiscalCode')
                      : t('addDelegationPage.selectTechPartner.labelName')
                  }
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    endAdornment: !techPartnerSelected ? <SearchIcon fontSize="small" /> : <></>,
                  }}
                />
              )}
              ListboxComponent={
                selectedRadioValue === 'fiscalCode' ? CustomListBoxComponent : undefined
              }
              renderOption={(props, option: BrokerResource) => (
                <MenuItem
                  {...props}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '44px',
                  }}
                  key={`${option.code}-${option.description}`}
                >
                  {selectedRadioValue === 'institutionName' ? null : (
                    <span style={{ flex: '0 0 40%' }}>{option.code}</span>
                  )}
                  <span
                    style={{
                      textAlign: 'start',
                      flex: 1,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {option.description}
                  </span>
                </MenuItem>
              )}
              noOptionsText={t('addDelegationPage.selectTechPartner.notFoundTechPartnerOptions')}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Stack direction="row" display="flex" justifyContent="space-between" mt={5}>
        <Button
          color="primary"
          variant="outlined"
          size="medium"
          onClick={() =>
            onExit(() =>
              history.push(
                resolvePathVariables(DASHBOARD_ROUTES.DELEGATIONS.path, {
                  partyId: party.partyId,
                })
              )
            )
          }
        >
          {t('addDelegationPage.selectTechPartner.actions.exit')}
        </Button>
        <Button
          disabled={!productSelected || !techPartnerSelected}
          onClick={() => confirmAddDelegateModal()}
          color="primary"
          variant="contained"
          type="submit"
          size="medium"
        >
          {t('addDelegationPage.selectTechPartner.actions.confirm')}
        </Button>
      </Stack>
    </>
  );
}
