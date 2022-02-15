import { Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PartyUser } from '../../../../model/PartyUser';
import { Party, UserRole } from '../../../../model/Party';
import { ProductRole } from '../../../../model/ProductRole';
import UserProductDetail from './UserProductDetail';

type Props = {
  selcRole: UserRole;
  productInfo: PartyUser;
  party: Party;
  productRoles: Array<ProductRole>;
  fetchPartyUsers: () => void;
};
export default function UserProductSection({ productInfo, party, productRoles, fetchPartyUsers}: Props) {
  return (
    <>
      <Grid item xs={10}>
        <Grid container item>
          <Grid item mb={1} xs={12}>
            <Typography variant="h3" sx={{ fontSize: '20px' }}>
              Prodotti
            </Typography>
          </Grid>
          <Grid item mb={1} xs={12}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Qui trovi tutti i dati dei prodotti relativi al tuo profilo
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ py: '10px', width: '120px' }}
          // onClick={() =>  } TODO
        >
          Aggiungi
        </Button>
      </Grid>
      <Grid item xs={12}>
        <UserProductDetail productInfo={productInfo} party={party} productRoles={productRoles} fetchPartyUsers={fetchPartyUsers} />
      </Grid>
    </>
  );
}
