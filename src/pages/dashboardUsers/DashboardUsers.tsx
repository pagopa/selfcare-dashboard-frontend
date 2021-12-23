import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Product } from '../../model/Product';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import TitleBox from '../../components/TitleBox';
import { Party } from '../../model/Party';
import Toast from '../../components/Toast';
import { STORAGE_KEY_NOTIFY_MESSAGE } from '../../utils/constants';
import { storageDelete, storageRead } from '../../utils/storage-utils';
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
  const [openToast, setOpenToast] = useState(false);
  const [message, setMessage] = useState();

  const notifyMessage = storageRead(STORAGE_KEY_NOTIFY_MESSAGE, 'string');
  useEffect(() => {
    if (notifyMessage) {
      setOpenToast(true);
      setMessage(notifyMessage);
      storageDelete(STORAGE_KEY_NOTIFY_MESSAGE);
    }
  }, [notifyMessage]);

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
              ? `Gestisci i Referenti Amministrativi e Operativi abilitati alla gestione del prodotto ${selectedProduct.title}.`
              : 'Gestisci i Referenti Amministrativi e Operativi abilitati alla gestione dei prodotti del tuo Ente.'
          }
        />
      </Grid>
      <Grid item xs={12}>
        <UsersSearch party={party} selectedProduct={selectedProduct} products={products} />
      </Grid>
      {openToast && (
        <Toast
          title={`REFERENTE AGGIUNTO`}
          message={<>{message}</>}
          closeToast={() => setOpenToast(false)}
        />
      )}
    </Grid>
  );
}
