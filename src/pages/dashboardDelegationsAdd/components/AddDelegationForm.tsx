import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
} from '@pagopa/selfcare-common-frontend';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BrokerResource } from '../../../api/generated/b4f-dashboard/BrokerResource';
import { InstitutionTypeEnum } from '../../../api/generated/b4f-dashboard/InstitutionResource';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../routes';
import { createDelegation, getProductBrokers } from '../../../services/partyService';
import { LOADING_TASK_DELEGATION_FORM } from '../../../utils/constants';
import { fetchDelegations } from '../../../services/delegationServices';
import { DelegationResource } from '../../../api/generated/b4f-dashboard/DelegationResource';

type Props = {
  authorizedDelegableProducts: Array<Product>;
  party: Party;
  selectedProductByQuery?: Product;
};

export default function AddDelegationForm({
  authorizedDelegableProducts,
  party,
  selectedProductByQuery,
}: Props) {
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
  const delegationsListRef = useRef(delegationsList);

  useEffect(() => {
    if (authorizedDelegableProducts.length === 1) {
      setProductSelected(authorizedDelegableProducts[0]);
    }
  }, [authorizedDelegableProducts]);

  useEffect(() => {
    if (selectedProductByQuery) {
      const chosenProduct = authorizedDelegableProducts.find(
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
      handleProductBrokers(productSelected.id, party.institutionType as InstitutionTypeEnum);
    }
  }, [productSelected]);

  const handleProductBrokers = (productId: string, institutionType: InstitutionTypeEnum) => {
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

  const handleSubmit = async () => {
    if (productSelected && techPartnerSelected) {
      setLoading(true);
      await createDelegation(party, productSelected, techPartnerSelected)
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

  return (
    <>
      <Grid container sx={{ backgroundColor: 'background.paper' }} p={3}>
        <Grid item xs={12} mb={3}>
          <Typography variant="h6" sx={{ fontWeight: 'fontWeightBold' }} mb={2}>
            {t('addDelegationPage.addOneDelegation')}
          </Typography>
          <Typography variant="body1">{t('addDelegationPage.formSubTitle')}</Typography>
          {/*
          TODO hide MUI Link until href for link is avaible
          <Link href={'#'} sx={{ fontWeight: 'bold' }} mt={1}>
            {t('addDelegationPage.findOutMore')}
          </Link>
          */}
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
              disabled={authorizedDelegableProducts.length === 1 || !!selectedProductByQuery}
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
              {authorizedDelegableProducts.map((p: Product, index) => (
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
            mbSubTitle={3}
            titleFontSize="16px"
            subTitleFontSize="16px"
            variantTitle="subtitle1"
            variantSubTitle="body2"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Autocomplete
              // TODO 'NAME' label hidden until Intermediated entities data is avaible
              // groupBy={() => t('addDelegationPage.selectTechPartner.groupByName')}
              options={productBrokers?.map((pb) => pb.description) ?? []}
              clearOnEscape
              onChange={(_e, selectedPb: string) => {
                const chosenBroker = productBrokers?.find((pb) => pb.description === selectedPb);
                setTechPartnerSelected(chosenBroker);
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
                  label={t('addDelegationPage.selectTechPartner.label')}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    endAdornment: !techPartnerSelected ? <SearchIcon fontSize="small" /> : <></>,
                  }}
                />
              )}
              renderOption={(props, options: any) => (
                <MenuItem {...props} sx={{ height: '44px' }}>
                  {options}
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
          onClick={() => handleSubmit()}
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
