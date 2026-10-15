import { ComponentType } from 'react';
import { CONTRACT_UPDATE_STEPS } from '../ContractUpdateWizardContext';
import { AdditionalDetailsStep } from './additionalDetailsStep/AdditionalDetailsStep';
import { DetailsStep } from './detailsStep/DetailsStep';
import { InformationStep } from './informationStep/InformationStep';

export const stepComponents: Record<(typeof CONTRACT_UPDATE_STEPS)[number], ComponentType> = {
  information: InformationStep,
  details: DetailsStep,
  additionalDetails: AdditionalDetailsStep,
};
