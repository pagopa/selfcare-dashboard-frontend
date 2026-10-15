import { ComponentType } from 'react';
import { CONTRACT_UPDATE_STEPS } from '../ContractUpdateWizardContext';
import { InstitutionDataStep } from './institutionDataStep/InstitutionDataStep';
import { AddLRStep } from './addLRStep/AddLRStep';
import { AddUsersStep } from './addUsersStep/AddUsersStep';

export const stepComponents: Record<(typeof CONTRACT_UPDATE_STEPS)[number], ComponentType> = {
  institutionData: InstitutionDataStep,
  addLR: AddLRStep,
  addUsers: AddUsersStep,
};
