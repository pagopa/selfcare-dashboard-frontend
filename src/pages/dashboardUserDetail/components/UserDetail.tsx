import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { PartyUser } from '../../../model/PartyUser';

const CustomLabelStyle = styled(Typography)({
  fontSize: '14px',
  color:'#5C6F82'
});

const CustomInfoStyle = styled(Typography)({
  color: '#000000',
  textTransform: 'capitalize',
});
type Props = {
  roleSection: React.ReactNode;
  userInfo: PartyUser;
};

export default function UserDetail({ roleSection, userInfo }: Props) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid container item alignContent='center'>
          <Grid item xs={3}>
            <CustomLabelStyle variant="h6" className="labelStyle" >
              NOME
            </CustomLabelStyle>
          </Grid>
          <Grid item xs={9} className="userInfoStyle">
            <CustomInfoStyle variant="body2" >{userInfo.name.toLocaleLowerCase()}</CustomInfoStyle>
          </Grid>
        </Grid>
        <Grid container item alignContent='center'>
          <Grid item xs={3}>
            <CustomLabelStyle variant="h6" className="labelStyle">
              COGNOME
            </CustomLabelStyle>
          </Grid>
          <Grid item xs={9}><CustomInfoStyle variant="body2" >{userInfo.surname}</CustomInfoStyle></Grid>
        </Grid>
        <Grid container item alignContent='center'>
          <Grid item xs={3}>
            <CustomLabelStyle variant="h6" className="labelStyle">
              CODICE FISCALE
            </CustomLabelStyle>
          </Grid>
          <Grid item xs={9}><CustomInfoStyle variant="body2" >ASDFLN99M44T555L</CustomInfoStyle></Grid>
        </Grid>
        <Grid container item alignContent='center'>
          <Grid item xs={3}>
            <CustomLabelStyle variant="h6" className="labelStyle">
              EMAIL ISTITUZIONALE
            </CustomLabelStyle>
          </Grid>
          <Grid item xs={9}><CustomInfoStyle variant="body2" >{userInfo.email}</CustomInfoStyle></Grid>
        </Grid>
        <Grid container item alignContent='center'>
          <Grid item xs={3}>
            <CustomLabelStyle variant="h6" className="labelStyle">
              ENTE
            </CustomLabelStyle>
          </Grid>
          <Grid item xs={9}><CustomInfoStyle variant="body2" >TEST</CustomInfoStyle></Grid>
        </Grid>

        <Grid container item alignContent='center'>
          {roleSection}
        </Grid>

        <Grid container item alignContent='center'>
          <Grid item xs={3}>
            <CustomLabelStyle variant="h6" className="labelStyle">
              DATA CREAZIONE
            </CustomLabelStyle>
          </Grid>
          <Grid item xs={9}><CustomInfoStyle variant="body2" >01/01/2001</CustomInfoStyle></Grid>
        </Grid>
        <Grid container item alignContent='center'>
          <Grid item xs={3}>
            <CustomLabelStyle variant="h6" className="labelStyle">
              ULTIMA MODIFICA
            </CustomLabelStyle>
          </Grid>
          <Grid item xs={9}><CustomInfoStyle variant="body2" >01/01/2001</CustomInfoStyle></Grid>
        </Grid>
      </Grid>
    </>
  );
}
