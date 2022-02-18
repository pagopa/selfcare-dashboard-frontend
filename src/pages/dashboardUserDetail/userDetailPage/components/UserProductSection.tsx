import { Button, Grid, Typography, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { useState } from 'react';
import { PartyUser } from '../../../../model/PartyUser';
import { Party } from '../../../../model/Party';
import { ProductsRolesMap } from '../../../../model/ProductRole';
import { Product } from '../../../../model/Product';
import UserProductDetail from './UserProductDetail';

type Props = {
  partyUser: PartyUser;
  party: Party;
  fetchPartyUser: () => void;
  productsRolesMap: ProductsRolesMap;
  products: Array<Product>;
};
export default function UserProductSection({
  partyUser,
  party,
  fetchPartyUser,
  productsRolesMap,
  products,
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

      {!partyUser.isCurrentUser &&
        products
          .filter((p) => p.userRole === 'ADMIN')
          .find((p) => !partyUser.products.find((pu) => pu.id === p.id)) && (
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
      {partyUser.products.map((userProduct, index) => {
        const product = products.find((p) => p.id === userProduct.id) as Product; // admin role will always see all products
        return (
          <Grid item xs={12} key={userProduct.id}>
            <UserProductDetail
              partyUser={partyUser}
              party={party}
              fetchPartyUser={fetchPartyUser}
              userProduct={userProduct}
              productRolesList={productsRolesMap[userProduct.id]}
              canEdit={product?.userRole === 'ADMIN'}
              product={product}
            />
            {index !== partyUser.products.length - 1 && (
              <Grid item xs={11} mb={4}>
                <Divider />
              </Grid>
            )}
          </Grid>
        );
      })}
    </>
  );
}
