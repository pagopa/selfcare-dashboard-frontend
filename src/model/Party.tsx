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
  attributes: Array<string>;
  urlLogo?: string;
  ipaCode?: string; // TODO is this mandatory?
  fiscalCode?: string; // TODO is this mandatory?
};

export const institutionInfo2Party = (institutionInfo: InstitutionInfo): Party => {
  const urlLogo = `${process.env.REACT_APP_URL_INSTITUTION_LOGO_PREFIX}${institutionInfo.institutionId}${process.env.REACT_APP_URL_INSTITUTION_LOGO_SUFFIX}`;
  return Object.assign({}, institutionInfo, { urlLogo }) as Party;
};
