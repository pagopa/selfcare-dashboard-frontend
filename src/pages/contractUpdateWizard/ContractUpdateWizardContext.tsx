import { createContext, Dispatch, ReactNode, useContext, useMemo, useReducer } from 'react';

export const CONTRACT_UPDATE_STEPS = ['institutionData', 'addLR', 'addUsers'] as const;

type ContractUpdateDraft = {
  details: string;
  additionalDetails: string;
};

type ContractUpdateWizardState = {
  activeStep: number;
  draft: ContractUpdateDraft;
};

type ContractUpdateWizardAction =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'reset' }
  | { type: 'updateDraft'; field: keyof ContractUpdateDraft; value: string };

export const initialWizardState: ContractUpdateWizardState = {
  activeStep: 0,
  draft: { details: '', additionalDetails: '' },
};

export const contractUpdateWizardReducer = (
  state: ContractUpdateWizardState,
  action: ContractUpdateWizardAction
): ContractUpdateWizardState => {
  switch (action.type) {
    case 'next':
      return {
        ...state,
        activeStep: Math.min(state.activeStep + 1, CONTRACT_UPDATE_STEPS.length - 1),
      };
    case 'back':
      return { ...state, activeStep: Math.max(state.activeStep - 1, 0) };
    case 'updateDraft':
      return { ...state, draft: { ...state.draft, [action.field]: action.value } };
    case 'reset':
      return initialWizardState;
  }
};

const ContractUpdateWizardContext = createContext<
  | {
      state: ContractUpdateWizardState;
      dispatch: Dispatch<ContractUpdateWizardAction>;
    }
  | undefined
>(undefined);

export const ContractUpdateWizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(contractUpdateWizardReducer, initialWizardState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ContractUpdateWizardContext.Provider value={value}>
      {children}
    </ContractUpdateWizardContext.Provider>
  );
};

export const useContractUpdateWizard = () => {
  const context = useContext(ContractUpdateWizardContext);
  if (!context) {
    throw new Error('useContractUpdateWizard must be used within ContractUpdateWizardProvider');
  }
  return context;
};
