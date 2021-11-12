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
  attributes: Array<string>;
  urlLogo?: string;
};

const buildUrlLog = (institutionId: string) =>
  `${process.env.REACT_APP_URL_INSTITUTION_LOGO_PREFIX}${institutionId}${process.env.REACT_APP_URL_INSTITUTION_LOGO_SUFFIX}`;

export const institutionInfo2Party = (institutionInfo: InstitutionInfo): Party => {
  const urlLogo = buildUrlLog(institutionInfo.institutionId);
  return Object.assign({}, institutionInfo, { urlLogo }) as Party;
};

export const institutionResource2Party = (institutionResource: InstitutionResource): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    institutionId: institutionResource.id ?? '',
    description: institutionResource.name ?? '',
    digitalAddress: institutionResource.mailAddress ?? '',
    status: 'Active', // TODO
    role: 'Operator', // TODO
    platformRole: 'admin', // TODO
    attributes: [], // TODO
    urlLogo,
  };
};
