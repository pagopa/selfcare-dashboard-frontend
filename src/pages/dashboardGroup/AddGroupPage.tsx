import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withGroupDetail, { withGroupDetailProps } from '../../decorators/withGroupDetail';
import { Product } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import AddGroupForm from './components/AddGroupForm';

type Props = {
  activeProducts: Array<Product>;
} & withGroupDetailProps;

function AddGroupPage({ party, activeProducts, productsMap, partyGroup }: Props) {
  const history = useHistory();

  const paths = [
    {
      description: 'Gruppi',
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUP.path, {
            institutionId: partyGroup.institutionId,
            groupId: partyGroup.id,
          })
        ),
    },
    {
      description: 'Crea un nuovo gruppo',
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
          title="Crea un nuovo gruppo"
          subTitle={`Inserisci i dati del gruppo che vuoi creare e assegna a gestire i gruppi per il ${party.description}.`}
        />
      </Grid>
      <Grid item xs={12}>
        <AddGroupForm
          party={party}
          products={activeProducts}
          productsMap={productsMap}
          PartyGroupExt={partyGroup}
          initialFormData={{
            name: '',
            description: '',
            members: [],
            institutionId: '',
            productId: '',
          }}
          canEdit={true}
        />
      </Grid>
    </Grid>
  );
}

export default withGroupDetail(AddGroupPage);
