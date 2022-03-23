import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import { Party } from '../../model/Party';
import { PartyGroupOnCreation } from '../../model/PartyGroup';
import { Product, ProductsMap } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import GroupForm from './components/GroupForm';

type Props = {
  party: Party;
  productsMap: ProductsMap;
  activeProducts: Array<Product>;
};

function AddGroupPage({ party, activeProducts, productsMap }: Props) {
  const history = useHistory();
  const { t } = useTranslation();
  const paths = [
    {
      description: 'Gruppi',
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.MAIN.path, {
            institutionId: party.institutionId,
          })
        ),
    },
    {
      description: t('dashboardGroupEdit.addGroupPage.pathDescription'),
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
        <GroupForm
          party={party}
          products={activeProducts}
          productsMap={productsMap}
          initialFormData={
            {
              name: '',
              description: '',
              members: [],
              institutionId: party.institutionId,
              productId: '',
            } as PartyGroupOnCreation
          }
          isClone={false}
        />
      </Grid>
    </Grid>
  );
}

export default AddGroupPage;
