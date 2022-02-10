import { Grid, Typography, IconButton, Divider } from '@mui/material';
import { Box, styled } from '@mui/system';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRole } from '../../../../model/Party';
import { PartyUser } from '../../../../model/PartyUser';
import UserProductActions from './../../components/UserProductActions';

const CustomLabelStyle = styled(Typography)({
  fontSize: '14px',
  color: '#5C6F82',
});

const CustomInfoStyle = styled(Typography)({
  color: '#000000',
  textTransform: 'capitalize',
});

type Props = {
  selcRole: UserRole;
  productInfo: PartyUser;
};
export default function UserProductDetail({ productInfo, selcRole }: Props) {
  return (
    <>
      {productInfo.products.map((product, index) => (
        <Box key={product.id}>
          <Grid item xs={11} mb={4}>
            {index !== productInfo.products.length - 1 && <Divider />}
          </Grid>
          <Grid container>
            <Grid item xs={7}>
              <Typography variant="h6" sx={{ fontSize: '18px' }} mt={5} mb={3}>
                {product.title}
              </Typography>
            </Grid>
            <Grid item xs={3} display='flex' alignItems='center'>
              <UserProductActions showActions={true} />
            </Grid>
          </Grid>
          <Grid container xs={10}>
            <Grid container item>
              <Grid item xs={3}>
                <CustomLabelStyle variant="h6" className="labelStyle">
                  COGNOME
                </CustomLabelStyle>
              </Grid>
              <Grid item xs={4}>
                <Grid item container>
                  <CustomInfoStyle variant="body2">
                    {roleLabels[selcRole].longLabel}
                  </CustomInfoStyle>
                  <IconButton
                    disableRipple
                    sx={{ padding: '0px', '&:hover': { backgroundColor: 'transparent' } }}
                  >
                    <InfoOutlinedIcon
                      sx={{ padding: '6px', color: '#A2ADB8', marginLeft: '8px' }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <UserProductActions showActions={true} />
              </Grid>
            </Grid>
            <Grid container item>
              {/* TODO: insert UserProductGroups component */}
            </Grid>
          </Grid>
        </Box>
      ))}
    </>
  );
}
