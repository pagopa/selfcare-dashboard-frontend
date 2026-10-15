import { useContractUpdateWizard } from '../../ContractUpdateWizardContext';

export const useDetailsStep = () => {
  const { state, dispatch } = useContractUpdateWizard();

  const setDetails = (value: string) => dispatch({ type: 'updateDraft', field: 'details', value });

  return { details: state.draft.details, setDetails };
};
