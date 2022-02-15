import { Button, Divider, Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Party } from '@pagopa/selfcare-common-frontend/model/Party';
import { useEffect } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import UserDetail from '../components/UserDetail';
import { PartyUser } from '../../../model/PartyUser';
import ProductNavigationBar from '../../../components/ProductNavigationBar';
import { DASHBOARD_ROUTES } from '../../../routes';
import { ProductRole } from '../../../model/ProductRole';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import withUserDetail from '../../../decorators/withUserDetail';
import UserSelcRole from './components/UserSelcRole';
import UserProductSection from './components/UserProductSection';

type Props ={
  partyUser: PartyUser;
  fetchPartyUsers: () => void;
}; 

// TODO: productRoles= mockedUser.roles
const productRoles: Array<ProductRole> = [
  {
    selcRole: 'ADMIN',
    productRole: 'Incaricato-Ente-creditore',
    displayableProductRole: 'Incaricato Ente creditore',
  },
  {
    selcRole: 'ADMIN',
    productRole: 'Referente-dei-pagamenti',
    displayableProductRole: 'Referente dei pagamenti',
  },
];

 function UserDetailPage({partyUser, fetchPartyUsers}:Props) {
  const history = useHistory();
  const party = useAppSelector(partiesSelectors.selectPartySelected);

  useEffect(() => {
    if(party)
    {trackEvent(
      'OPEN_USER_DETAIL',
      { party_id: party.institutionId });}
  }, [party]);

  const goBack = () =>
  history.push(
    resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.path, {
      institutionId: (party as Party).institutionId,
    })
  );

  const onDelete = () => {
    // TODO: add delete fetch
    fetchPartyUsers(); 
    goBack(); 
  };

  const paths = [
    {
      description: 'Referenti',
      onClick: goBack
    },
    {
      description: 'Dettaglio Referente',
    },
  ];
  return !party ? <></> : (
    <Grid
      container
      alignItems={'center'}
      px={0}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3}>
        <ProductNavigationBar  paths={paths} />
      </Grid>
      <Grid item xs={12} mb={7}>
        <Typography variant="h1">Dettaglio Referente</Typography>
      </Grid>
      <Grid container item>
        <Grid item xs={12} mb={9}>
          <UserDetail
            userInfo={partyUser}
            roleSection={<UserSelcRole selcRole={partyUser.userRole} />}
          />
        </Grid>
      </Grid>
      <Grid item xs={11} mb={4}>
        <Divider />
      </Grid>
      <Grid container item mb={9}>
        <UserProductSection productInfo={partyUser} selcRole={partyUser.userRole} party={party} productRoles={productRoles} fetchPartyUsers={fetchPartyUsers}/>
      </Grid>
      <Grid container item my={10} spacing={2}>
        <Grid item xs={2}>
          <Button
            disableRipple
            variant="outlined"
            sx={{ height: '40px', width: '100%' }}
            onClick={goBack} 
          >
            Indietro
          </Button>
        </Grid>
        {/* TODO:  se elimino nel then faccio fetchPartyUsers e il goBack */}
        {productRoles.length === 1 && <Grid item xs={2}>
          <Button
            disableRipple
            variant="outlined" 
            sx={{ height: '40px', width: '100%', color:"#C02927", borderColor:'#C02927'}}
            onClick={onDelete}
          >
            Elimina
          </Button>
        </Grid>}
      </Grid>
    </Grid>
  );
}
export default withUserDetail(UserDetailPage);