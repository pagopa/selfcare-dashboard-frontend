import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import AddDelegationForm from './components/AddDelegationForm';

type Props = {
  authorizedDelegableProducts: Array<Product>;
  party: Party;
};

export default function AddDelegationPage({ authorizedDelegableProducts, party }: Props) {
  const history = useHistory();
  const { t } = useTranslation();

  const productIdByQuery = new URLSearchParams(window.location.search).get('productId');
  const selectedProductByQuery = authorizedDelegableProducts.find(
    (dp) => dp.id === productIdByQuery
  );

  const goBack = () => {
    history.goBack();
  };

  const pathsWithProduct = [
    {
      description: t('addDelegationPage.navigationBar.delegations'),
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.DELEGATIONS.path, {
            partyId: party.partyId,
          })
        ),
    },
    {
      description: selectedProductByQuery?.title ?? '',
    },
    {
      description: t('addDelegationPage.navigationBar.addDelegation'),
    },
  ];

  const pathsWithoutProduct = pathsWithProduct.filter((_p, index) => index !== 1);

  return (
    <Grid
      container
      alignItems={'center'}
      px={3}
      mt={3}
      sx={{ width: '100%', backgroundColor: 'transparent !important' }}
    >
      <Grid container item xs={12} lg={8}>
        <Grid item xs={12}>
          <ProductNavigationBar
            paths={selectedProductByQuery ? pathsWithProduct : pathsWithoutProduct}
            showBackComponent={true}
            goBack={goBack}
            backLabel={t('addDelegationPage.selectTechPartner.actions.exit')}
          />
        </Grid>
        <Grid item xs={12}>
          <TitleBox
            variantTitle="h4"
            variantSubTitle="body1"
            title={t('addDelegationPage.title')}
            subTitle={t('addDelegationPage.subTitle')}
            mbTitle={1}
            mtTitle={2}
            mbSubTitle={5}
          />
        </Grid>
        <Grid item xs={11} mb={5}>
          <AddDelegationForm
            authorizedDelegableProducts={authorizedDelegableProducts}
            party={party}
            selectedProductByQuery={selectedProductByQuery}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
