import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import { Product } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import { Party } from '../../model/Party';
import AddDelegationForm from './components/AddDelegationForm';

type Props = {
  products: Array<Product>;
  party: Party;
};

export default function AddDelegationPage({ products, party }: Props) {
  const history = useHistory();
  const { t } = useTranslation();

  const goBack = () => {
    history.goBack();
  };

  const paths = [
    {
      icon: DashboardCustomize,
      description: t('addDelegationPage.navigationBar.overview'),
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.OVERVIEW.path, {
            partyId: party.partyId,
          })
        ),
    },
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
      description: products[0].title,
    },
    {
      description: t('addDelegationPage.navigationBar.addDelegation'),
    },
  ];

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
          <ProductNavigationBar paths={paths} showBackComponent={true} goBack={goBack} />
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
          <AddDelegationForm products={products} />
        </Grid>
      </Grid>
    </Grid>
  );
}
