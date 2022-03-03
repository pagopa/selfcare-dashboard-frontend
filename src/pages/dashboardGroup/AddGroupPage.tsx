import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { ProductsRolesMap } from '../../model/ProductRole';
import { DASHBOARD_ROUTES } from '../../routes';
import AddGroupForm from './components/AddGroupForm';

type Props = {
  party: Party;
  activeProducts: Array<Product>;
  productsRolesMap: ProductsRolesMap;
};

function AddGroupPage({ party, activeProducts, productsRolesMap }: Props) {
  const history = useHistory();

  const paths = [
    {
      description: 'Gruppi',
      onClick: () =>
        history.push(
          // TODO
          resolvePathVariables(
            DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.path, // TODO Pagina gruppi
            {
              institutionId: '',
              productId: '',
            }
          )
        ),
    },
    {
      description: 'Crea un nuovo gruppo',
    },
  ];

  return (
    <Grid
      container
      alignItems={'center'}
      px={2}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3}>
        <ProductNavigationBar paths={paths} />
      </Grid>
      <Grid item xs={12} mb={9}>
        <TitleBox
          title="Crea un nuovo gruppo"
          subTitle={`Inserisci i dati del gruppo che vuoi creare e assegna a gestire i gruppi per il ${party.description}.`}
        />
      </Grid>
      <Grid item xs={12}>
        <AddGroupForm // TODO
          party={party}
          products={activeProducts}
          productsRolesMap={productsRolesMap}
          initialFormData={{
            name: '',
            description: '',
            members: [],
            institutionId: '',
            productId: '',
          }}
          canEdit={true}
        />
      </Grid>
    </Grid>
  );
}

export default AddGroupPage;
