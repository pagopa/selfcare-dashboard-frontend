import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { Redirect, useParams } from 'react-router-dom';
import withSelectedParty from '../../../decorators/withSelectedParty';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES } from '../../../routes';
import { UPDATE_CONTRACT_ACTION } from '../list/productUtils';
import { ContractUpdateWizardLayout } from './components/ContractUpdateWizardLayout';
import { ContractUpdateWizardProvider } from './ContractUpdateWizardContext';

export const ContractUpdateWizardPage = () => {
  const { partyId, productId } = useParams<{ partyId: string; productId: string }>();
  const party = useAppSelector(partiesSelectors.selectPartySelected);

  if (!party || party.partyId !== partyId) {
    return null;
  }

  const canUpdateContract = party.products.some(
    (product) =>
      product.productId === productId &&
      product.productOnBoardingStatus === 'ACTIVE' &&
      product.userProductActions?.includes(UPDATE_CONTRACT_ACTION)
  );

  if (!canUpdateContract) {
    return <Redirect to={resolvePathVariables(DASHBOARD_ROUTES.DOCUMENTS.path, { partyId })} />;
  }

  return (
    <ContractUpdateWizardProvider key={`${partyId}/${productId}`}>
      <ContractUpdateWizardLayout />
    </ContractUpdateWizardProvider>
  );
};

export default withSelectedParty(ContractUpdateWizardPage);
