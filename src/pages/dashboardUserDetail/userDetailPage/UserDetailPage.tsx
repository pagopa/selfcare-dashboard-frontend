import { Button, Divider, Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Party } from '@pagopa/selfcare-common-frontend/model/Party';
import { useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import UserDetail from '../components/UserDetail';
import { PartyUser } from '../../../model/PartyUser';
import ProductNavigationBar from '../../../components/ProductNavigationBar';
import { DASHBOARD_ROUTES } from '../../../routes';
import { ProductRole } from '../../../model/ProductRole';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import withUserDetail from '../../../decorators/withUserDetail';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import UserSelcRole from './components/UserSelcRole';
import UserProductSection from './components/UserProductSection';

type Props = {
  partyUser: PartyUser;
  fetchPartyUser: () => void;
};

// TODO: productRoles= PartyUser.products.roles
const productRoles: Array<ProductRole> = [
  {
    selcRole: 'ADMIN',
    productRole: 'Incaricato-Ente-creditore',
    title: 'Incaricato Ente creditore',
  },
  {
    selcRole: 'ADMIN',
    productRole: 'Referente-dei-pagamenti',
    title: 'Referente dei pagamenti',
  },
];

function UserDetailPage({ partyUser, fetchPartyUser }: Props) {
  const history = useHistory();
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  // const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const [product, setProduct] = useState<any>();
  const [role, setRole] = useState<ProductRole>();

  useEffect(() => {
    if(party) {
      trackEvent('OPEN_USER_DETAIL', { party_id: party.institutionId });
    }
    const userProduct = partyUser.products.find((product) => product);
    setProduct(userProduct);
    const userRole =  productRoles.find((p) => p);
    setRole(userRole);
  }, [party]);

  const goBack = () =>
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.path, {
        institutionId: (party as Party).institutionId,
      })
    );

  const onDelete = () => {
    setLoading(true);
    // deletePartyUser(user)
    // .then((_) => {
    // fetchPartyUsers();
    goBack();
    // })
    // .catch
    // TODO: add delete fetch
  };

  const handleOpenDelete = () => {
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: 'Elimina Ruolo',
      message: (
        <>
          {'Stai per eliminare il ruolo '}
          <strong>{role?.title}</strong>
          {' di '}
          <strong>{product?.title} </strong>
          {' assegnato a '}
          <strong style={{ textTransform: 'capitalize' }}>
            {party && `${partyUser.name.toLocaleLowerCase()} ${partyUser.surname}`}
          </strong>
          {'.'}
          <br />
          {'Vuoi continuare?'}
        </>
      ),
      confirmLabel: 'Conferma',
      closeLabel: 'Annulla',
      onConfirm: onDelete,
    });
  };

  const paths = [
    {
      description: 'Referenti',
      onClick: goBack,
    },
    {
      description: 'Dettaglio Referente',
    },
  ];
  return !party ? (
    <></>
  ) : (
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
        <UserProductSection
          partyUser={partyUser}
          selcRole={partyUser.userRole}
          party={party}
          productRoles={productRoles}
          fetchPartyUser={fetchPartyUser}
        />
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
        {productRoles.length === 1 && !partyUser.isCurrentUser && (
          <Grid item xs={2}>
            <Button
              disableRipple
              variant="outlined"
              sx={{ height: '40px', width: '100%', color: '#C02927', borderColor: '#C02927', '&:hover':{borderColor:'#C02927', backgroundColor:'transparent' }}}
              onClick={handleOpenDelete}
            >
              Elimina
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
export default withUserDetail(UserDetailPage);
