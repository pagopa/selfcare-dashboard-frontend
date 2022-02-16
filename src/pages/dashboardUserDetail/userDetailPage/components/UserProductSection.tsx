import { Button, Grid, Typography, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PartyUser } from '../../../../model/PartyUser';
import { Party } from '../../../../model/Party';
import { ProductsRolesMap } from '../../../../model/ProductRole';
import UserProductDetail from './UserProductDetail';

type Props = {
  partyUser: PartyUser;
  party: Party;
  fetchPartyUser: () => void;
  productsRolesMap: ProductsRolesMap;
};
export default function UserProductSection({
  partyUser,
  party,
  fetchPartyUser,
  productsRolesMap
}: Props) {
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
      {!partyUser.isCurrentUser && (
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
      )}
      {partyUser.products.map((product, index) => (
        <Grid item xs={12} key={product.id}>
          <UserProductDetail
            partyUser={partyUser}
            party={party}
            fetchPartyUser={fetchPartyUser}
            product={product}
            productRolesList={productsRolesMap[product.id]}
          />
          {index !== partyUser.products.length - 1 && (
            <Grid item xs={11} mb={4}>
              <Divider />
            </Grid>
          )}
        </Grid>
      ))}
    </>
  );
}
