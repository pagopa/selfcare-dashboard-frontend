import { Grid, useMediaQuery } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
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
  const isMobile = useMediaQuery('@media (max-width: 600px)');

  const productIdByQuery = new URLSearchParams(window.location.search).get('productId');

  const selectedProductByQuery = authorizedDelegableProducts.find(
    (dp) => dp.id === productIdByQuery
  );

  const goBack = () => {
    history.goBack();
  };

  const paths = [
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
      description: t('addDelegationPage.navigationBar.addDelegation'),
    },
  ];

  const pathInMobileView = paths.filter((_p, index) => index === 0);

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
            paths={isMobile ? pathInMobileView : paths}
            showBackComponent={isMobile ? true : false}
            goBack={goBack}
            backLabel={t('addDelegationPage.navigationBar.delegations')}
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
            authorizedDelegableProducts={authorizedDelegableProducts}
            party={party}
            selectedProductByQuery={selectedProductByQuery}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
