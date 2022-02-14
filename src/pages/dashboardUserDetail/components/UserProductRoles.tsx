import { Box, Chip, Grid, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ProductRole } from '../../../model/ProductRole';
import { Party } from '../../../model/Party';
import UserProductActions from './UserProductActions';

type Props = {
  productRoles: Array<ProductRole>;
  showActions: boolean;
  party: Party;
};

const CustomLabelStyle = styled(Typography)({
  fontSize: '14px',
  color: '#5C6F82',
});

const CustomInfoStyle = styled(Typography)({
  color: '#000000',
  textTransform: 'capitalize',
});
export default function UserProductRoles({ productRoles, showActions, party }: Props) {
  return (
    <Grid container xs={12}>
      {productRoles.map((p) => (
        <Grid container item key={p.productRole}>
          <Grid item xs={3}>
            <Grid container item>
              <Box>
                <CustomLabelStyle variant="h6" className="labelStyle">
                  RUOLO
                </CustomLabelStyle>
              </Box>
              {party.status === 'SUSPENDED' && showActions && (
                <Box ml={2} >
                  <Chip
                    label="sospeso"
                    variant="outlined"
                    sx={{
                      fontWeight: '600',
                      fontSize: '14px',
                      background: '#00C5CA',
                      border:'none',
                      borderRadius: '16px',
                      width: '76px',
                      height: '24px',
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid item container>
              <Grid item xs={5}>
                <CustomInfoStyle
                  variant="body2"
                  sx={{ color: party.status === 'SUSPENDED' ? 'text.secondary' : '#000000' }}
                >
                  {p.displayableProductRole}
                  <IconButton
                    disableRipple
                    sx={{ padding: '0px', '&:hover': { backgroundColor: 'transparent' } }}
                  >
                    {/* TODO: verify the use */}
                    <InfoOutlinedIcon
                      sx={{ padding: '6px', color: '#A2ADB8', marginLeft: '8px' }}
                    />
                  </IconButton>
                </CustomInfoStyle>
              </Grid>
              <Grid item xs={4}>
                <UserProductActions
                  showActions={showActions}
                  party={party}
                  productRoles={productRoles}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
