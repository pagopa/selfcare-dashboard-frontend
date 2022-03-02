import { Button, Grid, Typography, styled } from '@mui/material';
import { Party } from '../../../model/Party';
import { PartyUser } from '../../../model/PartyUser';
import { ProductsMap } from '../../../model/Product';

const CustomLabelStyle = styled(Typography)({
  fontSize: '14px',
  color: '#5C6F82',
});

const CustomInfoStyle = styled(Typography)({
  color: '#000000',
});

const CustomStyleCapitolized = styled(Typography)({
  color: '#000000',
  textTransform: 'capitalize',
});

type Props = {
  party: Party;
  roleSection: React.ReactNode;
  userInfo: PartyUser;
  goEdit: () => void;
  productsMap: ProductsMap;
};

export default function UserDetail({ roleSection, userInfo, party, goEdit, productsMap }: Props) {
  return (
    <>
      <Grid container>
        <Grid item xs={10}>
          <Grid container spacing={2}>
            <Grid container item alignContent="center">
              <Grid item xs={3}>
                <CustomLabelStyle variant="h6" className="labelStyle">
                  NOME
                </CustomLabelStyle>
              </Grid>
              <Grid item xs={9} className="userInfoStyle">
                <CustomStyleCapitolized variant="body2">
                  {userInfo.name.toLocaleLowerCase()}
                </CustomStyleCapitolized>
              </Grid>
            </Grid>
            <Grid container item alignContent="center">
              <Grid item xs={3}>
                <CustomLabelStyle variant="h6" className="labelStyle">
                  COGNOME
                </CustomLabelStyle>
              </Grid>
              <Grid item xs={9}>
                <CustomStyleCapitolized variant="body2">
                  {userInfo.surname.toLocaleLowerCase()}
                </CustomStyleCapitolized>
              </Grid>
            </Grid>
            <Grid container item alignContent="center">
              <Grid item xs={3}>
                <CustomLabelStyle variant="h6" className="labelStyle">
                  CODICE FISCALE
                </CustomLabelStyle>
              </Grid>
              <Grid item xs={9}>
                <CustomInfoStyle variant="body2">{userInfo.taxCode}</CustomInfoStyle>
              </Grid>
            </Grid>
            <Grid container item alignContent="center">
              <Grid item xs={3}>
                <CustomLabelStyle variant="h6" className="labelStyle">
                  EMAIL ISTITUZIONALE
                </CustomLabelStyle>
              </Grid>
              <Grid item xs={9}>
                <CustomInfoStyle variant="body2">{userInfo.email}</CustomInfoStyle>
              </Grid>
            </Grid>
            <Grid container item alignContent="center">
              <Grid item xs={3}>
                <CustomLabelStyle variant="h6" className="labelStyle">
                  ENTE
                </CustomLabelStyle>
              </Grid>
              <Grid item xs={9}>
                <CustomInfoStyle variant="body2">{party.description}</CustomInfoStyle>
              </Grid>
            </Grid>

            <Grid container item alignContent="center">
              {roleSection}
            </Grid>
          </Grid>
        </Grid>
        {userInfo.products.find((p) => productsMap[p.id]?.userRole === 'ADMIN') && (
          <Grid item xs={2}>
            <Button
              disableRipple
              disabled={userInfo.status === 'SUSPENDED'}
              variant="contained"
              sx={{ height: '40px', width: '120px' }}
              onClick={goEdit}
            >
              Modifica
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
}
