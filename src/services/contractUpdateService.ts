import { DashboardApi } from '../api/DashboardApiClient';
import {
  ContractUpdateUserDto,
  RoleEnum,
} from '../api/generated/b4f-dashboard/ContractUpdateUserDto';
import {
  InstitutionTypeEnum,
  OnboardingContractUpdateDto,
} from '../api/generated/b4f-dashboard/OnboardingContractUpdateDto';
import { Party } from '../model/Party';
import {
  AdminPerson,
  ContractUpdateDraft,
  getVisibleAdmins,
} from '../pages/contractUpdateWizard/ContractUpdateWizardContext';

const toContractUpdateUser = (person: AdminPerson, role: RoleEnum): ContractUpdateUserDto => ({
  name: person.name.trim(),
  surname: person.surname.trim(),
  taxCode: person.taxCode.trim().toUpperCase(),
  email: person.email.trim(),
  role,
});

export const buildContractUpdateRequest = (
  party: Party,
  productId: string,
  draft: ContractUpdateDraft
): OnboardingContractUpdateDto => {
  // The onboarding of the product has its own origin data, the party values are a fallback
  const onboardedProduct = party.products.find((product) => product.productId === productId);
  const institutionType = onboardedProduct?.institutionType ?? party.institutionType;

  return {
    origin: onboardedProduct?.origin ?? party.origin ?? '',
    originId: onboardedProduct?.originId ?? party.originId ?? '',
    institutionType: institutionType as InstitutionTypeEnum | undefined,
    taxCode: party.fiscalCode,
    subunitCode: party.subunitCode,
    users: [
      toContractUpdateUser(draft.legalRepresentative, RoleEnum.MANAGER),
      ...getVisibleAdmins(draft).map((admin) => toContractUpdateUser(admin, RoleEnum.DELEGATE)),
    ],
  };
};

export const submitContractUpdate = (
  party: Party,
  productId: string,
  draft: ContractUpdateDraft
): Promise<void> => {
  /* istanbul ignore if */
  if (import.meta.env.VITE_API_MOCK_PARTIES === 'true') {
    return Promise.resolve();
  }
  return DashboardApi.onboardingContractUpdate(
    party.partyId,
    productId,
    buildContractUpdateRequest(party, productId, draft)
  );
};
