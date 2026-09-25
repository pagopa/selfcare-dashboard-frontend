import { SelcRoleEnum } from '../../api/generated/b4f-dashboard/ProductRoleMappingsResource';
import { ProductRolesApiResponse } from '../ProductRolesApiResponse';

const standardMappings = [
  {
    partyRole: 'DELEGATE',
    selcRole: SelcRoleEnum.ADMIN,
    productRoles: [
      {
        code: 'admin',
        description: 'Standard administrator',
        label: 'Amministratore',
        multiroleGroups: [],
      },
    ],
  },
];

const partnerTechMappings = [
  {
    partyRole: 'DELEGATE',
    selcRole: SelcRoleEnum.ADMIN,
    productRoles: [
      {
        code: 'admin-pt',
        description: 'Partner tech administrator',
        label: 'Referente dei Pagamenti',
        multiroleGroups: [],
      },
    ],
  },
];

export const mockedStandardProductRolesResponse: ProductRolesApiResponse = {
  roleMappings: standardMappings,
  partnerTechRoleMappings: partnerTechMappings,
};

export const mockedPartnerTechOnlyProductRolesResponse: ProductRolesApiResponse = {
  roleMappings: standardMappings,
  partnerTechRoleMappings: partnerTechMappings,
};

export const mockedMultiRoleProductRolesResponse: ProductRolesApiResponse = {
  roleMappings: standardMappings,
  partnerTechRoleMappings: partnerTechMappings,
};
