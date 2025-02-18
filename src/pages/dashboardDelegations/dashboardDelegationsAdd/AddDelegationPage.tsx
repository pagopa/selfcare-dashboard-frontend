import { Grid } from '@mui/material';
import { TitleBox, usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ProductNavigationBar from '../../../components/ProductNavigationBar';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import AddDelegationForm from './components/AddDelegationForm';

type Props = {
  authorizedDelegableProducts: Array<Product>;
  party: Party;
};

export default function AddDelegationPage({ authorizedDelegableProducts, party }: Readonly<Props>) {
  const history = useHistory();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const productIdByQuery = new URLSearchParams(window.location.search).get('productId');

  const productsWithCreateDelegationAction = authorizedDelegableProducts.filter((ap) =>
    hasPermission(ap.id, Actions.CreateDelegation)
  );

  const selectedProductByQuery = productsWithCreateDelegationAction.find(
    (dp) => dp.id === productIdByQuery
  );

  const goBack = () => {
    history.goBack();
  };

  return (
    <Grid
      container
      alignItems={'center'}
      justifyContent={'center'}
      px={3}
      mt={3}
      sx={{ width: '100%', backgroundColor: 'transparent !important' }}
    >
      <Grid container item xs={12} lg={8} display={'flex'} justifyContent={'center'}>
        <Grid item xs={12}>
          <ProductNavigationBar
            showBackComponent={true}
            goBack={goBack}
            backLabel={t('addDelegationPage.navigationBar.exit')}
            colorBackComponent="primary.main"
          />
        </Grid>
        <Grid item xs={12}>
          <TitleBox
            variantTitle="h4"
            variantSubTitle="body1"
            title={t('addDelegationPage.title')}
            subTitle={t('addDelegationPage.subTitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
          />
        </Grid>
        <Grid item xs={12} mb={5}>
          <AddDelegationForm
            productsWithCreateDelegationAction={productsWithCreateDelegationAction}
            party={party}
            selectedProductByQuery={selectedProductByQuery}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
