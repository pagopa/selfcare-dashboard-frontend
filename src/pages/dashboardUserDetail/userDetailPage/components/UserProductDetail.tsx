import { Grid, Typography, Chip } from '@mui/material';
import { Box } from '@mui/system';
import { Party } from '../../../../model/Party';
import { PartyUser, PartyUserProduct } from '../../../../model/PartyUser';
import UserProductRoles from '../../components/UserProductRoles';
import { ProductRolesLists } from '../../../../model/ProductRole';
import UserProductActions from './../../components/UserProductActions';

type Props = {
  partyUser: PartyUser;
  party: Party;
  fetchPartyUser: () => void;
  product: PartyUserProduct;
  productRolesList: ProductRolesLists;
};

export default function UserProductDetail({
  partyUser,
  party,
  fetchPartyUser,
  product,
  productRolesList
}: Props) {
  const showActionOnProduct = product.roles.length === 1;
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
                {party.status === 'SUSPENDED' && showActionOnProduct && (
                  <Chip
                    label="sospeso"
                    variant="outlined"
                    sx={{
                      fontWeight: '600',
                      fontSize: '14px',
                      background: '#00C5CA',
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
              role={product.roles[0]}
              user={partyUser}
              fetchPartyUser={fetchPartyUser}
              product={product}
              productRolesList={productRolesList}
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
            product={product}
            productRolesList={productRolesList}
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
