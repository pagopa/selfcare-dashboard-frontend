import { ComponentType } from 'react';
import { ContractUpdateDraft, ContractUpdateStepId } from '../ContractUpdateWizardContext';
import { InstitutionDataStep } from './institutionDataStep/InstitutionDataStep';
import { AddLRStep } from './addLRStep/AddLRStep';
import { validateLegalRepresentative } from './addLRStep/validation';
import { AddUsersStep } from './addUsersStep/AddUsersStep';
import { areAdminsValid } from './addUsersStep/validation';

export const stepComponents: Record<ContractUpdateStepId, ComponentType> = {
  institutionData: InstitutionDataStep,
  addLR: AddLRStep,
  addUsers: AddUsersStep,
};

// Steps without a validator can always be left
export const stepValidators: Partial<
  Record<ContractUpdateStepId, (draft: ContractUpdateDraft) => boolean>
> = {
  addLR: (draft) =>
    Object.keys(validateLegalRepresentative(draft.legalRepresentative)).length === 0,
  addUsers: areAdminsValid,
};
