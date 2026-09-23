import { ProductRoleMappingsResource } from '../api/generated/b4f-dashboard/ProductRoleMappingsResource';

export type CurrentUserProductRole = {
  code?: string;
  partyRole?: string;
  partnerTechRole?: boolean;
};

export type ProductRolesApiResponse = {
  roleMappings: Array<ProductRoleMappingsResource>;
  partnerTechRoleMappings?: Array<ProductRoleMappingsResource>;
  currentUserRoles?: Array<CurrentUserProductRole>;
};
