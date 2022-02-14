import { Button, Divider, Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import UserDetail from '../components/UserDetail';
import { mockedUsers } from '../../../services/__mocks__/usersService';
import { PartyUser } from '../../../model/PartyUser';
import UserProductRoles from '../components/UserProductRoles';
import { ProductRole } from '../../../model/ProductRole';
import { DASHBOARD_ROUTES } from '../../../routes';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { Product } from '../../../model/Product';
import { Party } from '../../../model/Party';
import ProductNavigationBar from '../../../components/ProductNavigationBar';

const mockedUser: PartyUser = mockedUsers[0];
const selectedProduct: Product = mockedPartyProducts[0];
const party: Party = mockedParties[0];

export default function UserProductDetailPage() {
  const history = useHistory();

  // TODO: productRoles = party.products.filter((p) => p.id === selectedProduct.id ).roles (PartyUser-> products-> roles)
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
          <UserDetail userInfo={mockedUser} roleSection={<></>} />
        </Grid>
      </Grid>
      <Grid item xs={11} my={6}>
        <Divider />
      </Grid>
      <UserProductRoles productRoles={productRoles} showActions={true} party={party} />
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
        {productRoles.length === 1 && (
          <Grid item xs={2}>
            <Button
              disableRipple
              variant="outlined"
              color="error"
              sx={{ height: '40px', width: '100%' }}
              // onClick={()=>}  TODO
            >
              Elimina
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
