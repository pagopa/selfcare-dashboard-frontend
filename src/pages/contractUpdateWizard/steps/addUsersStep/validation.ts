import { Admin, ContractUpdateDraft, getVisibleAdmins } from '../../ContractUpdateWizardContext';
import { PersonErrors, validatePerson } from '../addLRStep/validation';

const normalizeTaxCode = (taxCode: string) => taxCode.toUpperCase();

const normalizeEmail = (email: string) => email.toLowerCase();

const countValues = (values: Array<string>): Map<string, number> =>
  values
    .filter(Boolean)
    .reduce(
      (counts, value) => new Map(counts).set(value, (counts.get(value) ?? 0) + 1),
      new Map<string, number>()
    );

type DuplicateCheck = { lrValue: string; counts: Map<string, number> };

const isDuplicate = (value: string, { lrValue, counts }: DuplicateCheck) =>
  !!value && (value === lrValue || (counts.get(value) ?? 0) > 1);

const validateAdmin = (
  admin: Admin,
  taxCodes: DuplicateCheck,
  emails: DuplicateCheck
): PersonErrors => {
  const errors = validatePerson(admin);
  const withDuplicateTaxCode: PersonErrors =
    !errors.taxCode && isDuplicate(normalizeTaxCode(admin.taxCode), taxCodes)
      ? { ...errors, taxCode: 'duplicateTaxCode' }
      : errors;
  // The update-contract API fails when two users, Legal Representative included, share an email
  const withDuplicate: PersonErrors =
    !withDuplicateTaxCode.email && isDuplicate(normalizeEmail(admin.email), emails)
      ? { ...withDuplicateTaxCode, email: 'duplicateEmail' }
      : withDuplicateTaxCode;
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
  const taxCodes: DuplicateCheck = {
    lrValue: normalizeTaxCode(draft.legalRepresentative.taxCode),
    counts: countValues(admins.map((admin) => normalizeTaxCode(admin.taxCode))),
  };
  const emails: DuplicateCheck = {
    lrValue: normalizeEmail(draft.legalRepresentative.email),
    counts: countValues(admins.map((admin) => normalizeEmail(admin.email))),
  };
  return Object.fromEntries(
    admins.map((admin) => [admin.key, validateAdmin(admin, taxCodes, emails)])
  );
};

export const areAdminsValid = (draft: ContractUpdateDraft): boolean =>
  Object.values(validateAdmins(draft)).every((errors) => Object.keys(errors).length === 0);
