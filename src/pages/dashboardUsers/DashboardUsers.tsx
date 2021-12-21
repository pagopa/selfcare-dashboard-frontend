import { Grid } from '@mui/material';
import { Product } from '../../model/Product';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import TitleBox from '../../components/TitleBox';
import { Party } from '../../model/Party';
import UsersSearch from './components/usersSearch/UsersSearch';

interface Props {
  party: Party;
  products: Array<Product>;
  selectedProduct?: Product;
}

const paths = [
  {
    description: 'Referenti',
  },
];

export default function DashboardUsers({ party, selectedProduct, products }: Props) {
  return (
    <Grid
      container
      alignItems={'center'}
      px={0}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      {selectedProduct && (
        <Grid item xs={12} mb={3} px={'16px'}>
          <ProductNavigationBar selectedProduct={selectedProduct} paths={paths} />
        </Grid>
      )}
      <Grid item xs={12} mb={9} px={'16px'}>
        <TitleBox
          title="Referenti"
          subTitle={
            selectedProduct
              ? `Inserisci i dati della persona che vuoi autorizzare a gestire ${selectedProduct.description}`
              : 'Gestisci i Referenti Amministrativi e Operativi abilitati alla gestione dei prodotti del tuo Ente.'
          }
        />
      </Grid>
      <Grid item xs={12}>
        <UsersSearch party={party} selectedProduct={selectedProduct} products={products} />
      </Grid>
    </Grid>
  );
}
