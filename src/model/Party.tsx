import { InstitutionResource } from '../api/generated/b4f-dashboard/InstitutionResource';

export type UserRole = 'ADMIN' | 'LIMITED';

export type Party = {
  institutionId: string;
  description: string;
  digitalAddress: string;
  status: 'PENDING' | 'ACTIVE';
  userRole: UserRole;
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
    userRole: institutionResource.userRole as UserRole,
    category: institutionResource.category,
    urlLogo,
    fiscalCode: institutionResource.fiscalCode,
  };
};
