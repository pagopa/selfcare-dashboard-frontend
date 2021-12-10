import { Grid } from '@mui/material';
import { Product } from '../../../model/Product';
import AddUserForm from './AddUserForm';
import UserTitleComponent from './UserTitleComponent';
import ProductNavigationBar from './ProductNavigationBar';

type Props = {
  selectedProduct: Product;
};
export default function AddUserContainer({ selectedProduct }: Props) {
  // const [products, setProducts]=useState:()
  const paths = [
    {
      description: 'Referenti',
      onClick: () => {}, // TODO redirect to Ruoli Page
    },
    {
      description: 'Aggiungi un Referente',
    },
  ];
  return (
    <Grid container className="FormComponentContainer">
      <Grid item xs={12} mt={10} mb={3}>
        <ProductNavigationBar selectedProduct={selectedProduct} paths={paths} />
      </Grid>
      <Grid item xs={12} mb={9}>
        <UserTitleComponent
          title="Aggiungi un Referente"
          subTitle={`Inserisci i dati della persona che vuoi autorizzare a gestire ${selectedProduct.description}`}
        />
      </Grid>
      <Grid item xs={12}>
        <AddUserForm />
      </Grid>
    </Grid>
  );
}
