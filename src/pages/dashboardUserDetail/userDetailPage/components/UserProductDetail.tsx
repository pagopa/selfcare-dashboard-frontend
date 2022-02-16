import { Grid, Typography, Chip } from '@mui/material';
import { Box } from '@mui/system';
import { Party } from '../../../../model/Party';
import { PartyUser } from '../../../../model/PartyUser';
import UserProductRoles from '../../components/UserProductRoles';
import { ProductRole } from '../../../../model/ProductRole';
import UserProductActions from './../../components/UserProductActions';

type Props = {
  partyUser: PartyUser;
  party: Party;
  productRoles: Array<ProductRole>;
  fetchPartyUser: () => void;
  // product: any; // TODO
  userProduct: any;
};

export default function UserProductDetail({
  partyUser,
  party,
  productRoles,
  fetchPartyUser,
  userProduct
}: Props) {
  const showActionOnProduct = productRoles.length === 1;
  return (
    <>
      <Grid item xs={12}>
        <Grid container mt={5} mb={3}>
          <Grid item xs={7}>
            <Grid container item>
              <Box>
                <Typography variant="h6" sx={{ fontSize: '18px' }}>
                  {userProduct.title}
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
              productRoles={productRoles}
              role={productRoles[0]}
              user={partyUser}
              fetchPartyUser={fetchPartyUser}
              product={userProduct}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={12}>
          <UserProductRoles
            showActions={!showActionOnProduct}
            productRoles={productRoles}
            party={party}
            user={partyUser}
            fetchPartyUser={fetchPartyUser}
            userProduct={userProduct}
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
