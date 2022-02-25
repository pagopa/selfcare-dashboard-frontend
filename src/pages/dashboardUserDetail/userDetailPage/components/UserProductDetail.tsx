import { Grid, Typography, Chip, Box } from '@mui/material';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { PartyUser, PartyUserProduct } from '../../../../model/PartyUser';
import UserProductRoles from '../../components/UserProductRoles';
import { ProductRolesLists } from '../../../../model/ProductRole';
import UserProductActions from './../../components/UserProductActions';

type Props = {
  partyUser: PartyUser;
  party: Party;
  fetchPartyUser: () => void;
  userProduct: PartyUserProduct;
  productRolesList: ProductRolesLists;
  canEdit: boolean;
  product: Product;
};

export default function UserProductDetail({
  partyUser,
  party,
  fetchPartyUser,
  userProduct,
  productRolesList,
  canEdit,
  product,
}: Props) {
  const showActionOnProduct = userProduct.roles.length === 1;

  return (
    <>
      <Grid item xs={12}>
        <Grid container mt={5} mb={3}>
          <Grid item xs={7}>
            <Grid container item>
              <Box>
                <Typography variant="h6" sx={{ fontSize: '18px' }}>
                  {product.title}
                </Typography>
              </Box>
              <Box ml={2}>
                {userProduct.roles.find((p) => p.status === 'SUSPENDED') &&
                  showActionOnProduct &&
                  partyUser.products.find((p) => p.roles.find((r) => r.status === 'SUSPENDED')) && (
                    <Chip
                      label="sospeso"
                      variant="outlined"
                      sx={{
                        fontWeight: '600',
                        fontSize: '14px',
                        background: '#E0E0E0',
                        borderRadius: '16px',
                        width: '76px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    />
                  )}
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={3} display="flex" alignItems="center">
            <UserProductActions
              showActions={showActionOnProduct}
              party={party}
              role={userProduct.roles[0]}
              user={partyUser}
              fetchPartyUser={fetchPartyUser}
              product={userProduct}
              productRolesList={productRolesList}
              canEdit={canEdit}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={12}>
          <UserProductRoles
            showActions={!showActionOnProduct}
            party={party}
            user={partyUser}
            fetchPartyUser={fetchPartyUser}
            product={userProduct}
            productRolesList={productRolesList}
            canEdit={canEdit}
          />
        </Grid>
        {/* TODO: insert UserProductGroups component */}
        {/* <Grid container item>
              <UserProductGroups />
            </Grid> */}
      </Grid>
    </>
  );
}
