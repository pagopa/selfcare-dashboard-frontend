import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import AddDelegationForm from './components/AddDelegationForm';

type Props = {
  authorizedDelegableProducts: Array<Product>;
  party: Party;
};

export default function AddDelegationPage({ authorizedDelegableProducts, party }: Props) {
  const { t } = useTranslation();

  const productIdByQuery = new URLSearchParams(window.location.search).get('productId');
  const selectedProductByQuery = authorizedDelegableProducts.find(
    (dp) => dp.id === productIdByQuery
  );

  return (
    <Grid
      container
      alignItems={'center'}
      justifyContent={'center'}
      px={3}
      mt={3}
      sx={{ width: '100%', backgroundColor: 'transparent !important' }}
    >
      <Grid container item xs={12} lg={8}>
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
