import { InstitutionResource } from '../api/generated/b4f-dashboard/InstitutionResource';

export type UserRole = 'MANAGER' | 'DELEGATE' | 'OPERATOR';
export type UserPlatformRole = 'ADMIN' | 'ADMIN_REF' | 'TECH_REF';

export type Party = {
  institutionId: string;
  description: string;
  digitalAddress: string;
  status: 'PENDING' | 'ACTIVE';
  partyRole: UserPlatformRole;
  category: string;
  urlLogo?: string;
  fiscalCode: string;
};

const buildUrlLog = (institutionId: string) =>
  `${process.env.REACT_APP_URL_INSTITUTION_LOGO_PREFIX}${institutionId}${process.env.REACT_APP_URL_INSTITUTION_LOGO_SUFFIX}`;

export const institutionResource2Party = (institutionResource: InstitutionResource): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    institutionId: institutionResource.id,
    description: institutionResource.name,
    digitalAddress: institutionResource.mailAddress,
    status: institutionResource.status as 'ACTIVE' | 'PENDING',
    partyRole: institutionResource.userRole as UserPlatformRole,
    category: institutionResource.category,
    urlLogo,
    fiscalCode: institutionResource.fiscalCode,
  };
};
