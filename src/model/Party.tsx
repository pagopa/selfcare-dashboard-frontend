import { GeographicTaxonomyResource } from '../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { InstitutionResource } from '../api/generated/b4f-dashboard/InstitutionResource';
import { OnboardedProduct } from '../api/generated/b4f-dashboard/OnboardedProduct';
import { ENV } from '../utils/env';

export type UserRole = 'ADMIN' | 'LIMITED';
export type PartyRole = 'DELEGATE' | 'MANAGER' | 'OPERATOR' | 'SUB_DELEGATE';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'TOBEVALIDATED';

export type Party = {
  partyId: string;
  externalId?: string;
  originId?: string;
  origin?: string;
  description: string;
  digitalAddress?: string;
  status: UserStatus;
  userRole: UserRole;
  category?: string;
  urlLogo?: string;
  fiscalCode?: string;
  registeredOffice: string;
  zipCode: string;
  typology: string;
  institutionType?: string;
  recipientCode?: string;
  geographicTaxonomies: Array<GeographicTaxonomyResource>;
  vatNumberGroup?: boolean;
  supportEmail?: string;
  vatNumber?: string;
  subunitCode?: string;
  subunitType?: string;
  aooParentCode?: string;
  parentDescription?: string;
  products?: Array<OnboardedProduct>;
};

const buildUrlLog = (partyId: string) =>
  `${ENV.URL_INSTITUTION_LOGO.PREFIX}${partyId}${ENV.URL_INSTITUTION_LOGO.SUFFIX}`;

export const institutionResource2Party = (institutionResource: InstitutionResource): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    partyId: institutionResource.id ?? '',
    externalId: institutionResource.externalId ?? '',
    originId: institutionResource?.originId,
    origin: institutionResource?.origin,
    description: institutionResource.name ?? '',
    digitalAddress: institutionResource.mailAddress,
    status: institutionResource.status as UserStatus,
    userRole: institutionResource.userRole as UserRole,
    category: institutionResource.category,
    urlLogo,
    fiscalCode: institutionResource.fiscalCode,
    registeredOffice: institutionResource.address ?? '',
    zipCode: institutionResource.zipCode ?? '',
    typology: 'TODO', // it will represent the taxonomy of the party
    institutionType: institutionResource.institutionType,
    recipientCode: institutionResource.recipientCode,
    geographicTaxonomies:
      institutionResource.geographicTaxonomies as Array<GeographicTaxonomyResource>,
    vatNumberGroup: institutionResource.vatNumberGroup,
    supportEmail: institutionResource.supportContact?.supportEmail,
    vatNumber: institutionResource.vatNumber,
    subunitCode: institutionResource.subunitCode,
    subunitType: institutionResource.subunitType,
    aooParentCode: institutionResource.aooParentCode,
    parentDescription: institutionResource.parentDescription,
    products: institutionResource.products as Array<OnboardedProduct>,
  };
};
