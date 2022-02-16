import { Button, Divider, Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import { useEffect, useState } from 'react';
import UserDetail from '../components/UserDetail';
import { PartyUser } from '../../../model/PartyUser';
import UserProductRoles from '../components/UserProductRoles';
import { ProductRole } from '../../../model/ProductRole';
import { DASHBOARD_ROUTES } from '../../../routes';
import { Product } from '../../../model/Product';
import { Party } from '../../../model/Party';
import ProductNavigationBar from '../../../components/ProductNavigationBar';
import withSelectedPartyProduct from '../../../decorators/withSelectedPartyProduct';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import withUserDetail from '../../../decorators/withUserDetail';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';

type Props = {
  selectedProduct: Product;
  products: Array<Product>;
  partyUser: PartyUser;
  fetchPartyUser: () => void;
};

function UserProductDetailPage({ selectedProduct, partyUser, fetchPartyUser, products }: Props) {
  const history = useHistory();
  const party = useAppSelector(partiesSelectors.selectPartySelected) as Party;
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  // const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const [product, setProduct] = useState<Product>();
  const [role, setRole] = useState<ProductRole>();

  useEffect(() => {
    const product = products.find((product) => product.id === selectedProduct.id);
    setProduct(product);
    const userRole =  productRoles.find((p) => p);
    setRole(userRole);
  },[]);

  // TODO: productRoles = party.products.filter((p) => p.id === selectedProduct.id ).roles (PartyUser-> products-> roles)
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

  return (
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
        productRoles={productRoles}
        showActions={true}
        party={party}
        user={partyUser}
        fetchPartyUser={fetchPartyUser}
        userProduct={'ciao'}
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
        {productRoles.length === 1 && !partyUser.isCurrentUser && (
          <Grid item xs={2}>
            {/* TODO:  add delete fetch */}
            <Button
              disableRipple
              variant="outlined"
              sx={{ height: '40px', width: '100%', color: '#C02927', borderColor: '#C02927', '&:hover':{borderColor:'#C02927', backgroundColor:'transparent'} }}
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

export default withUserDetail(withSelectedPartyProduct(UserProductDetailPage));
