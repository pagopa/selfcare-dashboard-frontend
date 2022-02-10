import { Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import UsersTableFilters, { UsersTableFiltersConfig } from './UsersTableFilters';

interface UsersSearchProps {
  party: Party;
  selectedProduct?: Product;
  products: Array<Product>;
  addUserUrl: string;
  disableFilters: boolean;
  filters: UsersTableFiltersConfig;
  onFiltersChange: (filter: UsersTableFiltersConfig) => void;
}

export default function UsersTableActions({
  selectedProduct,
  products,
  addUserUrl,
  disableFilters,
  filters,
  onFiltersChange,
}: UsersSearchProps) {
  const history = useHistory();
  const onExit = useUnloadEventOnExit();

  return (
    <Grid container direction="row" justifyContent={'flex-end'} alignItems={'center'} px={2}>
      <Grid item>
        <UsersTableFilters
          selectedProduct={selectedProduct}
          disableFilters={disableFilters}
          filters={filters}
          onFiltersChange={onFiltersChange}
          products={products}
        />
      </Grid>
      <Grid item pl={4}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ py: '10px' }}
          onClick={() => onExit(() => history.push(addUserUrl))}
        >
          Aggiungi
        </Button>
      </Grid>
    </Grid>
  );
}
