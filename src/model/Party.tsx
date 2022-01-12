import { InstitutionResource } from '../api/generated/b4f-dashboard/InstitutionResource';
import { URL_INSTITUTION_LOGO_PREFIX, URL_INSTITUTION_LOGO_SUFFIX } from '../utils/env';

export type UserRole = 'ADMIN' | 'LIMITED';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export type Party = {
  institutionId: string;
  description: string;
  digitalAddress: string;
  status: UserStatus;
  userRole: UserRole;
  category?: string;
  urlLogo?: string;
  fiscalCode: string;
};

const buildUrlLog = (institutionId: string) =>
  `${URL_INSTITUTION_LOGO_PREFIX}${institutionId}${URL_INSTITUTION_LOGO_SUFFIX}`;

export const institutionResource2Party = (institutionResource: InstitutionResource): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    institutionId: institutionResource.id,
    description: institutionResource.name,
    digitalAddress: institutionResource.mailAddress,
    status: institutionResource.status as 'ACTIVE' | 'PENDING',
    userRole: institutionResource.userRole as UserRole,
    category: institutionResource.category,
    urlLogo,
    fiscalCode: institutionResource.fiscalCode,
  };
};
