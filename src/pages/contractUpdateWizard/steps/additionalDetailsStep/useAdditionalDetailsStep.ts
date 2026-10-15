import { useContractUpdateWizard } from '../../ContractUpdateWizardContext';

export const useAdditionalDetailsStep = () => {
  const { state, dispatch } = useContractUpdateWizard();

  const setAdditionalDetails = (value: string) =>
    dispatch({ type: 'updateDraft', field: 'additionalDetails', value });

  return { additionalDetails: state.draft.additionalDetails, setAdditionalDetails };
};
