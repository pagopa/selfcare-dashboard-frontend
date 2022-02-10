import { Button, Divider, Grid, Typography } from '@mui/material';
import UserDetail from '../components/UserDetail';
import { mockedUsers } from '../../../services/__mocks__/usersService';
import { PartyUser } from '../../../model/PartyUser';
import UserBreadcrumb from '../components/UserBreadcrumb';
import UserSelcRole from './components/UserSelcRole';
import UserProductSection from './components/UserProductSection';

const mockedUser: PartyUser = mockedUsers[0];

export default function UserDetailPage() {
  return (
    <Grid
      container
      alignItems={'center'}
      px={0}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3}>
        <UserBreadcrumb />
      </Grid>
      <Grid item xs={12} mb={7}>
        <Typography variant="h1">Dettaglio Referente</Typography>
      </Grid>
      <Grid container item>
        <Grid item xs={10} mb={9}>
          <UserDetail
            userInfo={mockedUser}
            roleSection={<UserSelcRole selcRole={mockedUser.userRole} />}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            disableRipple
            variant="contained"
            sx={{ height: '40px', width: '120px' }}
            // onClick={() =>  }
          >
            Modifica
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={11} mb={4}>
        <Divider />
      </Grid>
      <Grid container item mb={9}>
        <UserProductSection productInfo={mockedUser} selcRole={mockedUser.userRole} />
      </Grid>
      <Grid container item my={10}>
        <Grid item xs={2}>
          <Button
            disableRipple
            variant="outlined"
            sx={{ height: '40px', width: '100%' }}
            // onClick={() =>  }
          >
            Indietro
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
