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

/**
 * Temporary compatibility type for the period before the backend OpenAPI is
 * available. The concrete property names must be aligned with the BE contract.
 */
export type LegacyProductRolesApiResponse = Array<ProductRoleMappingsResource>;
