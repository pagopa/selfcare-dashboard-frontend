import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
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
  const [techPartnerSelected, setTechPartnerSelected] = useState<any>(); // TODO Fix with the model of Tech Partners

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
            <InputLabel
              id="tech-partner-label"
              size="normal"
              sx={{
                '.MuiInputLabel-root.Mui-focused': {
                  color: 'text.primary',
                  fontWeight: 'fontWeightBold',
                },
              }}
            >
              {t('addDelegationPage.selectTechPartner.label')}
            </InputLabel>
            <Select
              id="tech-partner-select"
              IconComponent={SearchIcon}
              size="medium"
              disabled={false}
              fullWidth
              value={undefined}
              displayEmpty
              variant="outlined"
              labelId="select-tech-partner"
              label={t('addDelegationPage.selectTechPartner.label')}
              input={<OutlinedInput label={t('addDelegationPage.selectTechPartner.label')} />}
            >
              {productBrokers?.map((pb: BrokerResource, index) => (
                <MenuItem
                  key={index}
                  value={pb.description}
                  sx={{ fontSize: '14px', color: '#000000' }}
                  onClick={() => setTechPartnerSelected(pb)}
                >
                  {pb.description}
                </MenuItem>
              ))}
            </Select>
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
