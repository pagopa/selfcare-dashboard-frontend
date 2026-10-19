import { emailRegexp } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { isPecEmail } from '@pagopa/selfcare-common-frontend/lib/utils/utils';
import { verifyChecksumMatchWithTaxCode } from '@pagopa/selfcare-common-frontend/lib/utils/verifyChecksumMatchWithTaxCode';
import { verifyNameMatchWithTaxCode } from '@pagopa/selfcare-common-frontend/lib/utils/verifyNameMatchWithTaxCode';
import { verifySurnameMatchWithTaxCode } from '@pagopa/selfcare-common-frontend/lib/utils/verifySurnameMatchWithTaxCode';
import { LegalRepresentative } from '../../ContractUpdateWizardContext';

// Same rules used for the Legal Representative in selfcare-dashboard-users-microfrontend
export const taxCodeRegexp = new RegExp(
  '^[A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1}$'
);

export type LegalRepresentativeError =
  | 'required'
  | 'nameMismatch'
  | 'surnameMismatch'
  | 'invalidTaxCode'
  | 'invalidEmail'
  | 'pecEmail';

export type LegalRepresentativeErrors = Partial<
  Record<keyof LegalRepresentative, LegalRepresentativeError>
>;

const validateName = (name: string, taxCode: string): LegalRepresentativeError | undefined => {
  if (!name) {
    return 'required';
  }
  return verifyNameMatchWithTaxCode(name, taxCode) ? 'nameMismatch' : undefined;
};

const validateSurname = (
  surname: string,
  taxCode: string
): LegalRepresentativeError | undefined => {
  if (!surname) {
    return 'required';
  }
  return verifySurnameMatchWithTaxCode(surname, taxCode) ? 'surnameMismatch' : undefined;
};

// verifyChecksumMatchWithTaxCode returns true when the checksum does NOT match
const validateTaxCode = (taxCode: string): LegalRepresentativeError | undefined => {
  if (!taxCode) {
    return 'required';
  }
  return !taxCodeRegexp.test(taxCode) || verifyChecksumMatchWithTaxCode(taxCode)
    ? 'invalidTaxCode'
    : undefined;
};

const validateEmail = (email: string): LegalRepresentativeError | undefined => {
  if (!email) {
    return 'required';
  }
  if (!emailRegexp.test(email)) {
    return 'invalidEmail';
  }
  return isPecEmail(email) ? 'pecEmail' : undefined;
};

export const validateLegalRepresentative = ({
  name,
  surname,
  taxCode,
  email,
}: LegalRepresentative): LegalRepresentativeErrors => {
  const errors: LegalRepresentativeErrors = {
    name: validateName(name, taxCode),
    surname: validateSurname(surname, taxCode),
    taxCode: validateTaxCode(taxCode),
    email: validateEmail(email),
  };
  return Object.fromEntries(
    Object.entries(errors).filter(([, error]) => error !== undefined)
  ) as LegalRepresentativeErrors;
};
