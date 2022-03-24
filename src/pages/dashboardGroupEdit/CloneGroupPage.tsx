import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withGroupDetail, { withGroupDetailProps } from '../../decorators/withGroupDetail';
import { PartyGroupOnEdit } from '../../model/PartyGroup';
import { Product } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import GroupForm from './components/GroupForm';

type Props = {
  activeProducts: Array<Product>;
} & withGroupDetailProps;

function CloneGroupPage({ party, activeProducts, productsMap, partyGroup }: Props) {
  const history = useHistory();
  const { t } = useTranslation();

  const paths = [
    {
      description: t('dashboardGroupEdit.cloneGroupPage.groupPathDescription'),
      onClick: () =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.MAIN.path, {
            institutionId: party.institutionId,
            groupId: partyGroup.id,
          })
        ),
    },
    {
      description: t('dashboardGroupEdit.cloneGroupPage.pathDescription'),
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
          title={t('dashboardGroupEdit.cloneGroupPage.title')}
          subTitle={t('dashboardGroupEdit.cloneGroupPage.subTitle')}
        />
      </Grid>
      <Grid item xs={12}>
        <GroupForm
          party={party}
          products={activeProducts}
          productsMap={productsMap}
          partyGroupCloneId={partyGroup.id}
          initialFormData={
            {
              id: '',
              name:
                t('dashboardGroupEdit.cloneGroupPage.placeholderDuplicateName') + partyGroup.name,
              description: partyGroup.description,
              members: partyGroup.members,
              institutionId: partyGroup.institutionId,
              productId:
                productsMap[partyGroup.productId]?.userRole === 'ADMIN'
                  ? partyGroup.productId
                  : undefined,
            } as PartyGroupOnEdit
          }
          isClone={true}
        />
      </Grid>
    </Grid>
  );
}

export default withGroupDetail(CloneGroupPage);
