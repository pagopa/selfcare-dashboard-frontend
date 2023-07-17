import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import {
  TitleBox,
  useErrorDispatcher,
  useUnloadEventOnExit,
} from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Product } from '../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../routes';
import { Party } from '../../../model/Party';
import { InstitutionTypeEnum } from '../../../api/generated/b4f-dashboard/InstitutionResource';
import { BrokerResource } from '../../../api/generated/b4f-dashboard/BrokerResource';
import { getProductBrokers } from '../../../services/partyService';

type Props = {
  delegateEnabledProducts: Array<Product>;
  selectedProduct?: Product;
  party: Party;
};

const CustomAutocomplete = styled(Autocomplete)({
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: `inset 10px 10px  #E6E9F2`,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#0073E6',
    borderRadius: '16px',
  },
  overflowY: 'auto',
  height: '100%',
});

export default function AddDelegationForm({
  delegateEnabledProducts,
  selectedProduct,
  party,
}: Props) {
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
  const { t } = useTranslation();
  const addError = useErrorDispatcher();

  const [_loading, setLoading] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<Product>();
  const [productBrokers, setProductBrokers] = useState<Array<BrokerResource>>();
  const [techPartnerSelected, setTechPartnerSelected] = useState<BrokerResource>();

  useEffect(() => {
    if (delegateEnabledProducts.length === 1) {
      setProductSelected(delegateEnabledProducts[0]);
    }
  }, [delegateEnabledProducts]);

  useEffect(() => {
    if (productSelected) {
      handleProductBrokers(productSelected.id, 'PT' as InstitutionTypeEnum);
    }
  }, [productSelected]);

  const handleProductBrokers = (productId: string, institutionType: InstitutionTypeEnum) => {
    setLoading(true);
    getProductBrokers(productId, institutionType)
      .then((pb) => setProductBrokers(pb))
      .catch((reason) => {
        addError({
          id: 'WRONG_FILE_EXTENSION',
          blocking: false,
          toNotify: false,
          error: reason,
          techDescription: `Cannot find product brokers for product: ${productId} and institution type: ${institutionType}`,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Grid container sx={{ backgroundColor: 'background.paper' }} p={3}>
        <Grid item xs={12} mb={4}>
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
              disabled={delegateEnabledProducts.length === 1 || !!selectedProduct}
              fullWidth
              value={
                delegateEnabledProducts.length === 1
                  ? delegateEnabledProducts[0].title
                  : selectedProduct?.title
              }
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
              {delegateEnabledProducts.map((p: Product, index) => (
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
            mbSubTitle={4}
            titleFontSize="16px"
            subTitleFontSize="16px"
            variantTitle="subtitle1"
            variantSubTitle="body2"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <CustomAutocomplete
              size="medium"
              options={productBrokers?.map((pb) => pb.description) ?? []}
              onChange={(_event, selectedPb: any) => {
                setTechPartnerSelected(selectedPb);
              }}
              clearIcon={<SearchIcon color="error" />}
              disableClearable
              sx={{
                '.MuiOutlinedInput-root.MuiInputBase-root.MuiInputBase-adornedEnd.MuiAutocomplete-inputRoot':
                  {
                    paddingRight: '9px',
                  },
              }}
              renderInput={(params) => (
                <TextField
                  sx={{
                    '.MuiInputLabel-root.Mui-focused': {
                      color: 'text.primary',
                      fontWeight: 'fontWeightBold',
                    },
                  }}
                  {...params}
                  placeholder={t('addDelegationPage.selectTechPartner.label')}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
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
          {t('addDelegationPage.selectTechPartner.actions.back')}
        </Button>
        <Button
          disabled={!productSelected || !techPartnerSelected}
          color="primary"
          variant="contained"
          type="submit"
          size="medium"
        >
          {t('addDelegationPage.selectTechPartner.actions.continue')}
        </Button>
      </Stack>
    </>
  );
}
