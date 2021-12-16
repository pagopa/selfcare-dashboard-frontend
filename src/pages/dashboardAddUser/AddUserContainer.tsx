import { Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Product } from '../../model/Product';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import TitleBox from '../../components/TitleBox';
import withSelectedPartyProduct from '../../decorators/withSelectedPartyProduct';
import { DASHBOARD_ROUTES, resolvePathVariables } from '../../routes';
import { Party } from '../../model/Party';
import AddUserForm from './components/AddUserForm';

type Props = {
  party: Party;
  products: Array<Product>;
  selectedProduct: Product;
};

function AddUserContainer({ party, selectedProduct }: Props) {
  const history = useHistory();

  const paths = [
    {
      description: 'Referenti',
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.subRoutes.MAIN.path, {
            institutionId: party.institutionId,
            productId: selectedProduct.id,
          })
        ),
    },
    {
      description: 'Aggiungi un Referente',
    },
  ];

  return (
    <Grid
      container
      alignItems={'center'}
      px={2}
      mt={10}
      sx={{ width: '953px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3}>
        <ProductNavigationBar selectedProduct={selectedProduct} paths={paths} />
      </Grid>
      <Grid item xs={12} mb={9}>
        <TitleBox
          title="Aggiungi un Referente"
          subTitle={`Inserisci i dati della persona che vuoi autorizzare a gestire ${selectedProduct.description}`}
        />
      </Grid>
      <Grid item xs={12} >
        <AddUserForm party={party} selectedProduct={selectedProduct} />
      </Grid>
    </Grid>
  );
}

export default withSelectedPartyProduct(AddUserContainer);
