import { Admin, ContractUpdateDraft, getVisibleAdmins } from '../../ContractUpdateWizardContext';
import { PersonErrors, validatePerson } from '../addLRStep/validation';

const countTaxCodes = (admins: Array<Admin>): Map<string, number> =>
  admins
    .map((admin) => admin.taxCode.toUpperCase())
    .filter(Boolean)
    .reduce(
      (counts, taxCode) => new Map(counts).set(taxCode, (counts.get(taxCode) ?? 0) + 1),
      new Map<string, number>()
    );

const validateAdmin = (
  admin: Admin,
  lrTaxCode: string,
  taxCodeCounts: Map<string, number>
): PersonErrors => {
  const errors = validatePerson(admin);
  const taxCode = admin.taxCode.toUpperCase();
  const isDuplicate = !!taxCode && (taxCode === lrTaxCode || (taxCodeCounts.get(taxCode) ?? 0) > 1);
  const withDuplicate: PersonErrors =
    !errors.taxCode && isDuplicate ? { ...errors, taxCode: 'duplicateTaxCode' } : errors;
  // The logged user can edit only their email, so the other fields are not validated
  return admin.isLoggedUser
    ? withDuplicate.email
      ? { email: withDuplicate.email }
      : {}
    : withDuplicate;
};

// Returns the errors of every visible admin, indexed by card key
export const validateAdmins = (draft: ContractUpdateDraft): Record<string, PersonErrors> => {
  const admins = getVisibleAdmins(draft);
  const lrTaxCode = draft.legalRepresentative.taxCode.toUpperCase();
  const taxCodeCounts = countTaxCodes(admins);
  return Object.fromEntries(
    admins.map((admin) => [admin.key, validateAdmin(admin, lrTaxCode, taxCodeCounts)])
  );
};

export const areAdminsValid = (draft: ContractUpdateDraft): boolean =>
  Object.values(validateAdmins(draft)).every((errors) => Object.keys(errors).length === 0);
