import { Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Product } from '../../model/Product';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withSelectedPartyProduct from '../../decorators/withSelectedPartyProduct';
import { DASHBOARD_ROUTES } from '../../routes';
import { Party } from '../../model/Party';
import { productRoles2ProductRolesList } from '../../model/ProductRole';
import { mockedProductRoles } from '../../services/__mocks__/usersService';
import { PartyUserOnCreation } from '../../model/PartyUser';
import AddUserForm from './components/AddUserForm';

type Props = {
  party: Party;
  products: Array<Product>;
  selectedProduct: Product;
  initialValues: PartyUserOnCreation;
};

function AddUsersProductPage({ party, selectedProduct, products, initialValues }: Props) {
  const history = useHistory();
  // TODO READ THIS INFORMATION USING DECORATOR
  const productsRolesMapMock = {
    [selectedProduct.id]: productRoles2ProductRolesList(mockedProductRoles),
  };

  const paths = [
    {
      description: 'Referenti',
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.subRoutes.MAIN.path, {
            institutionId: party.institutionId,
            productId: selectedProduct.id,
          })
        ),
    },
    {
      description: 'Aggiungi un Referente',
    },
  ];

  return (
    <Grid
      container
      alignItems={'center'}
      px={2}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3}>
        <ProductNavigationBar selectedProduct={selectedProduct} paths={paths} />
      </Grid>
      <Grid item xs={12} mb={9}>
        <TitleBox
          title="Aggiungi un Referente"
          subTitle={`Inserisci i dati della persona che vuoi autorizzare a gestire ${selectedProduct.title}`}
        />
      </Grid>
      <Grid item xs={12}>
        <AddUserForm
          party={party}
          selectedProduct={selectedProduct}
          products={products}
          productsRolesMap={productsRolesMapMock}
          canEditRegistryData={true}
          initialFormData={initialValues}
        />
      </Grid>
    </Grid>
  );
}

export default withSelectedPartyProduct(AddUsersProductPage);
