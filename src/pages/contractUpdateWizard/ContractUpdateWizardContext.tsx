import { createContext, Dispatch, ReactNode, useContext, useMemo, useReducer } from 'react';

export const CONTRACT_UPDATE_STEPS = ['institutionData', 'addLR', 'addUsers'] as const;

export type ContractUpdateStepId = (typeof CONTRACT_UPDATE_STEPS)[number];

export type LegalRepresentative = {
  name: string;
  surname: string;
  taxCode: string;
  email: string;
};

export type ContractUpdateDraft = {
  legalRepresentative: LegalRepresentative;
  additionalDetails: string;
};

type ContractUpdateWizardState = {
  activeStep: number;
  // true after the user tried to continue from a step with invalid data
  showErrors: boolean;
  draft: ContractUpdateDraft;
};

type ContractUpdateWizardAction =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'reset' }
  | { type: 'showErrors' }
  | { type: 'updateDraft'; field: 'additionalDetails'; value: string }
  | { type: 'updateLegalRepresentative'; field: keyof LegalRepresentative; value: string };

export const initialWizardState: ContractUpdateWizardState = {
  activeStep: 0,
  showErrors: false,
  draft: {
    legalRepresentative: { name: '', surname: '', taxCode: '', email: '' },
    additionalDetails: '',
  },
};

export const contractUpdateWizardReducer = (
  state: ContractUpdateWizardState,
  action: ContractUpdateWizardAction
): ContractUpdateWizardState => {
  switch (action.type) {
    case 'next':
      return {
        ...state,
        showErrors: false,
        activeStep: Math.min(state.activeStep + 1, CONTRACT_UPDATE_STEPS.length - 1),
      };
    case 'back':
      return { ...state, showErrors: false, activeStep: Math.max(state.activeStep - 1, 0) };
    case 'showErrors':
      return { ...state, showErrors: true };
    case 'updateDraft':
      return { ...state, draft: { ...state.draft, [action.field]: action.value } };
    case 'updateLegalRepresentative':
      return {
        ...state,
        draft: {
          ...state.draft,
          legalRepresentative: {
            ...state.draft.legalRepresentative,
            [action.field]: action.value,
          },
        },
      };
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
