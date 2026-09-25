import { ProductRoleMappingsResource } from '../api/generated/b4f-dashboard/ProductRoleMappingsResource';

export type ProductRolesApiResponse = {
  roleMappings: Array<ProductRoleMappingsResource>;
  partnerTechRoleMappings?: Array<ProductRoleMappingsResource>;
};
