import { useLocation, useParams } from 'react-router-dom';
import withSelectedParty from '../../decorators/withSelectedParty';
import { ContractUpdateWizardLayout } from './components/ContractUpdateWizardLayout';
import { ContractUpdateWizardProvider } from './ContractUpdateWizardContext';

export const ContractUpdateWizardPage = () => {
  const { partyId } = useParams<{ partyId: string }>();
  const { search } = useLocation();
  const productId = new URLSearchParams(search).get('productId');

  return (
    <ContractUpdateWizardProvider key={`${partyId}/${productId ?? ''}`}>
      <ContractUpdateWizardLayout />
    </ContractUpdateWizardProvider>
  );
};

export default withSelectedParty(ContractUpdateWizardPage);
