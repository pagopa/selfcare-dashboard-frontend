import { useParams } from 'react-router-dom';
import withSelectedParty from '../../decorators/withSelectedParty';
import { ContractUpdateWizardLayout } from './components/ContractUpdateWizardLayout';
import { ContractUpdateWizardProvider } from './ContractUpdateWizardContext';

export const ContractUpdateWizardPage = () => {
  const { partyId, productId } = useParams<{ partyId: string; productId: string }>();

  return (
    <ContractUpdateWizardProvider key={`${partyId}/${productId}`}>
      <ContractUpdateWizardLayout />
    </ContractUpdateWizardProvider>
  );
};

export default withSelectedParty(ContractUpdateWizardPage);
