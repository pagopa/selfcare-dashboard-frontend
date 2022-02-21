import { Grid, styled, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withProductsRolesMap, {
  withProductsRolesMapProps,
} from '../../decorators/withProductsRolesMap';
import { Party } from '../../model/Party';
import { PartyUserOnCreation } from '../../model/PartyUser';
import { Product } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import { mockedUsers } from '../../services/__mocks__/usersService';
import AddUserForm from './components/AddUserForm';

const CustomLabelStyle = styled(Typography)({
  fontSize: '14px',
  color: '#5C6F82',
});

const CustomInfoStyle = styled(Typography)({
  color: '#000000',
  textTransform: 'capitalize',
});

type Props = {
  party: Party;
  products: Array<Product>;
} & withProductsRolesMapProps;

const userInfo = mockedUsers[0]; // TODO RemoveMe

function AddProductToUserPage({ party, products, productsRolesMap }: Props) {
  const history = useHistory();
  const paths = [
    {
      description: 'Referenti',
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.subRoutes.MAIN.path, {
            institutionId: party.institutionId,
          })
        ),
    },
    {
      description: userInfo.name + ' ' + userInfo.surname,
    },
    {
      description: 'Aggiungi Prodotto',
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
        <ProductNavigationBar paths={paths} />
      </Grid>
      <Grid item xs={12} mb={9}>
        <TitleBox
          title="Aggiungi prodotto"
          subTitle={`Assegna un prodotto al referente abilitato per ${party.description}`}
        />
      </Grid>
      <Grid item xs={12} mb={9}>
        <Grid container>
          <Grid item xs={10}>
            <Grid container spacing={2}>
              <Grid container item alignContent="center">
                <Grid item xs={3}>
                  <CustomLabelStyle variant="h6" className="labelStyle">
                    NOME
                  </CustomLabelStyle>
                </Grid>
                <Grid item xs={9} className="userInfoStyle">
                  <CustomInfoStyle variant="body2">
                    {userInfo.name.toLocaleLowerCase()}
                  </CustomInfoStyle>
                </Grid>
              </Grid>
              <Grid container item alignContent="center">
                <Grid item xs={3}>
                  <CustomLabelStyle variant="h6" className="labelStyle">
                    COGNOME
                  </CustomLabelStyle>
                </Grid>
                <Grid item xs={9}>
                  <CustomInfoStyle variant="body2">{userInfo.surname}</CustomInfoStyle>
                </Grid>
              </Grid>
              <Grid container item alignContent="center">
                <Grid item xs={3}>
                  <CustomLabelStyle variant="h6" className="labelStyle">
                    CODICE FISCALE
                  </CustomLabelStyle>
                </Grid>
                <Grid item xs={9}>
                  <CustomInfoStyle variant="body2">{userInfo.taxCode}</CustomInfoStyle>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} mb={9}>
        <AddUserForm
          party={party}
          products={products} // TODO Products che non ha
          productsRolesMap={productsRolesMap}
          initialFormData={
            {
              taxCode: userInfo.taxCode,
              name: userInfo.name,
              surname: userInfo.surname,
              email: userInfo.email,
              confirmEmail: userInfo.email,
              id: userInfo.id,
              productRoles: [],
              certification: userInfo.certification,
            } as PartyUserOnCreation
          }
          canEditRegistryData={false}
        />
      </Grid>
    </Grid>
  );
}

export default withProductsRolesMap(AddProductToUserPage);
