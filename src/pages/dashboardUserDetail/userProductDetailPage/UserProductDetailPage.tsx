import { Button, Divider, Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import { useEffect, useState } from 'react';
import UserDetail from '../components/UserDetail';
import { PartyUser, PartyUserProduct } from '../../../model/PartyUser';
import UserProductRoles from '../components/UserProductRoles';
import { transcodeProductRole2Title } from '../../../model/ProductRole';
import { DASHBOARD_ROUTES } from '../../../routes';
import { Party } from '../../../model/Party';
import ProductNavigationBar from '../../../components/ProductNavigationBar';
import withSelectedPartyProduct from '../../../decorators/withSelectedPartyProduct';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import withUserDetail from '../../../decorators/withUserDetail';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import withSelectedPartyProductAndRoles, {
  withSelectedPartyProductAndRolesProps,
} from '../../../decorators/withSelectedPartyProductAndRoles';

type Props = withSelectedPartyProductAndRolesProps & {
  partyUser: PartyUser;
  fetchPartyUser: () => void;
};

function UserProductDetailPage({
  selectedProduct,
  partyUser,
  fetchPartyUser,
  productRolesList,
}: Props) {
  const history = useHistory();
  const party = useAppSelector(partiesSelectors.selectPartySelected) as Party;
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  // const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const [product, setProduct] = useState<PartyUserProduct>();
  const canEdit = selectedProduct.userRole === 'ADMIN';

  useEffect(() => {
    const product = partyUser.products.find((product) => product.id === selectedProduct.id);
    setProduct(product);
  }, []);

  // TODO: add delete fetch
  const onDelete = () => {
    setLoading(true);
    // deletePartyUser(user)
    // .then((_) => {
    // fetchPartyUsers();
    // TODO: add Toast
    goBack();
    // })
    // .catch
  };

  const handleOpenDelete = () => {
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: 'Elimina Ruolo',
      message: (
        <>
          {'Stai per eliminare il ruolo '}
          <strong>
            {transcodeProductRole2Title(
              (product as PartyUserProduct).roles[0].role,
              productRolesList
            )}
          </strong>
          {' di '}
          <strong>{(product as PartyUserProduct).title} </strong>
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

  const goBack = () =>
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.subRoutes.MAIN.path, {
        institutionId: party.institutionId,
        productId: selectedProduct.id,
      })
    );

  const paths = [
    {
      description: 'Referenti',
      onClick: goBack,
    },
    {
      description: 'Dettaglio Referente',
    },
  ];

  return product ? (
    <Grid
      container
      alignItems={'center'}
      px={0}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3}>
        <ProductNavigationBar paths={paths} selectedProduct={selectedProduct} />
      </Grid>
      <Grid item xs={12} mb={7}>
        <Typography variant="h1">Dettaglio Referente</Typography>
      </Grid>
      <Grid container item>
        <Grid item xs={12} mb={9}>
          <UserDetail userInfo={partyUser} roleSection={<></>} />
        </Grid>
      </Grid>
      <Grid item xs={11} my={6}>
        <Divider />
      </Grid>
      <UserProductRoles
        showActions={true}
        party={party}
        user={partyUser}
        fetchPartyUser={fetchPartyUser}
        product={product}
        productRolesList={productRolesList}
        canEdit={canEdit}
      />
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
        {product.roles.length === 1 && !partyUser.isCurrentUser && canEdit && (
          <Grid item xs={2}>
            <Button
              disableRipple
              variant="outlined"
              sx={{
                height: '40px',
                width: '100%',
                color: '#C02927',
                borderColor: '#C02927',
                '&:hover': { borderColor: '#C02927', backgroundColor: 'transparent' },
              }}
              onClick={handleOpenDelete}
            >
              Elimina
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  ) : (
    <></>
  );
}

export default withUserDetail(
  withSelectedPartyProduct(withSelectedPartyProductAndRoles(UserProductDetailPage))
);
