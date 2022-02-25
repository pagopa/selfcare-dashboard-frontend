import { Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import { DASHBOARD_ROUTES } from '../../routes';
import { Party } from '../../model/Party';
import { PartyUser } from '../../model/PartyUser';
import { Product } from '../../model/Product';
import { mockedUsers } from '../../services/__mocks__/usersService';
import EditUserRegistryForm from './components/EditUserRegistryForm';

type Props = {
  party: Party;
  user: PartyUser | null;
};

function EditUserRegistryPage({ party /* ,user TODO */ }: Props) {
  const user = mockedUsers[0]; // TODO RemoveMe
  const history = useHistory();

  const paths = [
    {
      description: 'Referenti',
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.path, {
            institutionId: party.institutionId,
          })
        ),
    },
    {
      description: 'Modifica Referente',
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
        <ProductNavigationBar
          paths={paths}
          selectedProduct={null as unknown as Product /* TODO RemoveMe */}
        />
      </Grid>
      <Grid item xs={12} mb={9}>
        <TitleBox
          title="Modifica Referente"
          subTitle={`Modifica i dati della persona che hai autorizzato a gestire ${user.products[0].title}.`}
        />
      </Grid>
      <Grid item xs={12}>
        {user ? (
          <EditUserRegistryForm party={party} user={user} />
        ) : (
          "Impossibile individuare l'utente desiderato"
        )}
      </Grid>
    </Grid>
  );
}

export default EditUserRegistryPage;
