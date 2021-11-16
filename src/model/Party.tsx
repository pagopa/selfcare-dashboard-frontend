import { InstitutionResource } from '../api/generated/b4f-dashboard/InstitutionResource';
import { InstitutionInfo } from '../api/generated/party-process/InstitutionInfo';

export type UserRole = 'Manager' | 'Delegate' | 'Operator';
export type UserPlatformRole = 'admin' | 'security' | 'api';

export type Party = {
  institutionId: string;
  description: string;
  digitalAddress: string;
  status: 'Pending' | 'Active';
  role: UserRole;
  platformRole: UserPlatformRole;
  category?: string; // TODO fix on CardProduct
  urlLogo?: string;
  ipaCode?: string; // TODO is this mandatory?
  fiscalCode?: string; // TODO is this mandatory?
};

const buildUrlLog = (institutionId: string) =>
  `${process.env.REACT_APP_URL_INSTITUTION_LOGO_PREFIX}${institutionId}${process.env.REACT_APP_URL_INSTITUTION_LOGO_SUFFIX}`;

export const institutionInfo2Party = (institutionInfo: InstitutionInfo): Party => {
  const urlLogo = buildUrlLog(institutionInfo.institutionId);
  return {
    institutionId: institutionInfo.institutionId,
    description: institutionInfo.description,
    digitalAddress: institutionInfo.digitalAddress,
    status: institutionInfo.status as 'Pending' | 'Active',
    role: institutionInfo.role as UserRole,
    platformRole: institutionInfo.platformRole as UserPlatformRole,
    category:
      institutionInfo.attributes && institutionInfo.attributes.length > 0
        ? institutionInfo.attributes[0]
        : undefined,
    urlLogo,
  };
};

export const institutionResource2Party = (institutionResource: InstitutionResource): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    institutionId: institutionResource.id,
    description: institutionResource.name,
    digitalAddress: institutionResource.mailAddress,
    status: institutionResource.status as 'Active' | 'Pending',
    role: institutionResource.userRole as UserRole,
    platformRole: 'admin', // TODO bind after model update
    category: institutionResource.category,
    urlLogo,
  };
};
