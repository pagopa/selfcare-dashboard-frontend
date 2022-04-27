import { InstitutionResource } from '../api/generated/b4f-dashboard/InstitutionResource';
import { ENV } from '../utils/env';

export type UserRole = 'ADMIN' | 'LIMITED';
export type PartyRole = 'DELEGATE' | 'MANAGER' | 'OPERATOR' | 'SUB_DELEGATE';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export type Party = {
  partyId: string;
  // externalId: string;
  originId?: string;
  description: string;
  digitalAddress: string;
  status: UserStatus;
  userRole: UserRole;
  category?: string;
  urlLogo?: string;
  fiscalCode: string;
};

const buildUrlLog = (institutionId: string) =>
  `${ENV.URL_INSTITUTION_LOGO.PREFIX}${institutionId}${ENV.URL_INSTITUTION_LOGO.SUFFIX}`;

export const institutionResource2Party = (institutionResource: InstitutionResource): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    partyId: institutionResource.id,
    description: institutionResource.name,
    digitalAddress: institutionResource.mailAddress,
    status: institutionResource.status as 'ACTIVE' | 'PENDING',
    userRole: institutionResource.userRole as UserRole,
    category: institutionResource.category,
    urlLogo,
    fiscalCode: institutionResource.fiscalCode,
  };
};
