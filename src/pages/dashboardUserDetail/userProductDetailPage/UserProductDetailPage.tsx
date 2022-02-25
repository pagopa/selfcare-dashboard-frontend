import { Button, Divider, Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import { useEffect, useState } from 'react';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import UserDetail from '../components/UserDetail';
import { PartyUser, PartyUserProduct } from '../../../model/PartyUser';
import UserProductRoles from '../components/UserProductRoles';
import { transcodeProductRole2Title } from '../../../model/ProductRole';
import { DASHBOARD_ROUTES } from '../../../routes';
import ProductNavigationBar from '../../../components/ProductNavigationBar';
import withSelectedPartyProduct from '../../../decorators/withSelectedPartyProduct';
import withUserDetail from '../../../decorators/withUserDetail';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import withSelectedPartyProductAndRoles, {
  withSelectedPartyProductAndRolesProps,
} from '../../../decorators/withSelectedPartyProductAndRoles';
import { deletePartyUser } from './../../../services/usersService';

type Props = withSelectedPartyProductAndRolesProps & {
  partyUser: PartyUser;
  fetchPartyUser: () => void;
};

function UserProductDetailPage({
  selectedProduct,
  partyUser,
  fetchPartyUser,
  productRolesList,
  party,
}: Props) {
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const [userProduct, setUserProduct] = useState<PartyUserProduct>();
  const canEdit = selectedProduct.userRole === 'ADMIN';

  useEffect(() => {
    const userProduct = partyUser.products.find((product) => product.id === selectedProduct.id);
    setUserProduct(userProduct);
    if (!userProduct) {
      history.push(
        resolvePathVariables(DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.path, {
          institutionId: party.institutionId,
          productId: selectedProduct.id,
        })
      );
    }
  }, []);

  const onDelete = () => {
    setLoading(true);
    deletePartyUser(
      party,
      partyUser,
      userProduct as PartyUserProduct,
      (userProduct as PartyUserProduct).roles[0]
    )
      .then((_) => {
        goBack();
      })
      .catch((reason) =>
        addError({
          id: `DELETE_PARTY_USER_ERROR-${partyUser.id}`,
          blocking: false,
          error: reason,
          techDescription: `Something gone wrong while deleting role ${
            (userProduct as PartyUserProduct).roles[0].relationshipId
          } for product ${(userProduct as PartyUserProduct).title}`,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
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
              (userProduct as PartyUserProduct).roles[0].role,
              productRolesList
            )}
          </strong>
          {' di '}
          <strong>{(userProduct as PartyUserProduct).title} </strong>
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

  const goEdit = () =>
    history.push(
      resolvePathVariables(
        DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.subRoutes.EDIT_PARTY_PRODUCT_USER.path,
        {
          institutionId: party.institutionId,
          userId: partyUser.id,
          productId: selectedProduct.id,
        }
      )
    );

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

  return userProduct ? (
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
        <Grid item xs={12}>
          <UserDetail party={party} userInfo={partyUser} roleSection={<></>} goEdit={goEdit} />
        </Grid>
      </Grid>
      <Grid item xs={11} my={5}>
        <Divider />
      </Grid>
      <UserProductRoles
        showActions={true}
        party={party}
        user={partyUser}
        fetchPartyUser={fetchPartyUser}
        userProduct={userProduct}
        product={selectedProduct}
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
        {userProduct.roles.length === 1 && !partyUser.isCurrentUser && canEdit && (
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
