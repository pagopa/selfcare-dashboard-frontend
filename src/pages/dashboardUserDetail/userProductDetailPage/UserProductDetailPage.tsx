import { Button, Divider, Grid, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
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

type Props={
  selectedProduct:Product;
  products: Array<Product>;
  partyUser: PartyUser;
};

function UserProductDetailPage({selectedProduct, partyUser}:Props) {
  const history = useHistory();
  const party = useAppSelector(partiesSelectors.selectPartySelected) as Party;

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
          <UserDetail userInfo={partyUser} roleSection={<></>} />
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
              sx={{ height: '40px', width: '100%', color:"#C02927", borderColor:'#C02927' }}
              // onClick={()=>}  TODO
            >
              Elimina
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default withUserDetail(withSelectedPartyProduct(UserProductDetailPage));
