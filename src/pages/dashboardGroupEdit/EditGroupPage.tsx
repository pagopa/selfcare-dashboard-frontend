import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withGroupDetail, { withGroupDetailProps } from '../../decorators/withGroupDetail';
import { PartyGroupOnEdit } from '../../model/PartyGroup';
import { Product } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import AddGroupForm from './components/GroupForm';

type Props = {
  activeProducts: Array<Product>;
} & withGroupDetailProps;

function EditGroupPage({ party, activeProducts, productsMap, partyGroup }: Props) {
  const history = useHistory();

  const paths = [
    {
      description: 'Gruppi',
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.MAIN.path, {
            institutionId: party.institutionId,
            groupId: partyGroup.id,
          })
        ),
    },
    {
      description: 'Modifica gruppo',
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
        <TitleBox title="Modifica gruppo" subTitle={`Duplica il gruppo e modifica i dati`} />
      </Grid>
      <Grid item xs={12}>
        <AddGroupForm
          party={party}
          products={activeProducts}
          productsMap={productsMap}
          initialFormData={
            {
              id: partyGroup.id,
              name: partyGroup.name,
              description: partyGroup.description,
              members: partyGroup.members,
              institutionId: partyGroup.institutionId,
              productId: partyGroup.productId,
            } as PartyGroupOnEdit
          }
          isClone={false}
        />
      </Grid>
    </Grid>
  );
}

export default withGroupDetail(EditGroupPage);
