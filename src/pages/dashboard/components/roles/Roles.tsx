import { Grid } from '@mui/material';
import { useParams } from 'react-router';
import { Product } from '../../../../model/Product';
import ProductNavigationBar from '../../addUser/ProductNavigationBar';
import UserTitleComponent from '../../addUser/UserTitleComponent';
import RolesSearch from './components/rolesSearch/RolesSearch';

interface Roles {
  products: Array<Product>;
}

export default function Roles({ products }: Roles) {
  const paths = [
    {
      description: 'Referenti',
      onClick: () => {}, // TODO redirect to Ruoli Page
    },
  ];
  const { productId } = useParams<any>();
  const selectedProduct = productId ? products.find((p) => p.id === productId) : undefined;
  return (
    <Grid
      container
      alignItems={'center'}
      px={0}
      mt={10}
      sx={{ width: '953px', backgroundColor: 'transparent !important' }}
    >
      {selectedProduct && (
        <Grid item xs={12} mb={3} px={'16px'}>
          <ProductNavigationBar selectedProduct={selectedProduct} paths={paths} />
        </Grid>
      )}
      <Grid item xs={12} mb={9} px={'16px'}>
        <UserTitleComponent
          title="Referenti"
          subTitle={
            selectedProduct
              ? `Inserisci i dati della persona che vuoi autorizzare a gestire ${selectedProduct.description}`
              : 'Gestisci i Referenti Amministrativi e Operativi abilitati alla gestione dei prodotti del tuo Ente.'
          }
        />
      </Grid>
      <Grid item xs={12}>
        <RolesSearch selectedProduct={selectedProduct} products={products} />
      </Grid>
    </Grid>
  );
}
