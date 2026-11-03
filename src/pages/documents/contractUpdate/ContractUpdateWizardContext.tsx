import { createContext, Dispatch, ReactNode, useContext, useMemo, useReducer } from 'react';
import {
  Admin,
  AdminPerson,
  ContractUpdateDraft,
  LegalRepresentative,
} from '../../../model/ContractUpdate';

export const CONTRACT_UPDATE_STEPS = ['institutionData', 'addLR', 'addUsers'] as const;

export type ContractUpdateStepId = (typeof CONTRACT_UPDATE_STEPS)[number];

export type AdminsStatus = 'idle' | 'loading' | 'loaded';

export type ContractUpdateWizardState = {
  activeStep: number;
  // true after the user tried to continue from a step with invalid data
  showErrors: boolean;
  adminsStatus: AdminsStatus;
  nextAdminKey: number;
  draft: ContractUpdateDraft;
};

type ContractUpdateWizardAction =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'reset' }
  | { type: 'showErrors' }
  | { type: 'updateLegalRepresentative'; field: keyof LegalRepresentative; value: string }
  | { type: 'loadAdminsStart' }
  | { type: 'loadAdmins'; admins: Array<Omit<Admin, 'key'>> }
  | { type: 'addAdmin' }
  | { type: 'updateAdmin'; key: string; field: keyof AdminPerson; value: string }
  | { type: 'removeAdmin'; key: string };

export const initialWizardState: ContractUpdateWizardState = {
  activeStep: 0,
  showErrors: false,
  adminsStatus: 'idle',
  nextAdminKey: 0,
  draft: {
    legalRepresentative: { name: '', surname: '', taxCode: '', email: '' },
    admins: [],
  },
};

const emptyAdminPerson: AdminPerson = { name: '', surname: '', taxCode: '', email: '' };

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
    case 'loadAdminsStart':
      return { ...state, adminsStatus: 'loading' };
    case 'loadAdmins':
      // Ignore duplicate completions (e.g. StrictMode effect replay) so user edits are kept
      if (state.adminsStatus === 'loaded') {
        return state;
      }
      return {
        ...state,
        adminsStatus: 'loaded',
        nextAdminKey: state.nextAdminKey + action.admins.length,
        draft: {
          ...state.draft,
          admins: action.admins.map((admin, index) => ({
            ...admin,
            key: `admin-${state.nextAdminKey + index}`,
          })),
        },
      };
    case 'addAdmin':
      return {
        ...state,
        nextAdminKey: state.nextAdminKey + 1,
        draft: {
          ...state.draft,
          admins: [
            ...state.draft.admins,
            { ...emptyAdminPerson, key: `admin-${state.nextAdminKey}` },
          ],
        },
      };
    case 'updateAdmin':
      return {
        ...state,
        draft: {
          ...state.draft,
          admins: state.draft.admins.map((admin) =>
            admin.key === action.key ? { ...admin, [action.field]: action.value } : admin
          ),
        },
      };
    case 'removeAdmin':
      return {
        ...state,
        draft: {
          ...state.draft,
          admins: state.draft.admins.filter((admin) => admin.key !== action.key),
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

export const ContractUpdateWizardProvider = ({
  children,
  initialState = initialWizardState,
}: {
  children: ReactNode;
  initialState?: ContractUpdateWizardState;
}) => {
  const [state, dispatch] = useReducer(contractUpdateWizardReducer, initialState);
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
