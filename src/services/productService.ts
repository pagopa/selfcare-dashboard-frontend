import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product, productResource2Product } from '../model/Product';
import {
  CurrentUserProductRoleContext,
  ProductRole,
  selectProductRolesForCurrentUser,
} from '../model/ProductRole';
import {
  LegacyProductRolesApiResponse,
  ProductRolesApiResponse,
} from '../model/ProductRolesApiResponse';
import {
  fetchProductRoles as fetchProductRolesMocked,
  mockedPartyProducts,
} from './__mocks__/productService';

const isProductRolesApiResponse = (
  response: ProductRolesApiResponse | LegacyProductRolesApiResponse
): response is ProductRolesApiResponse => !Array.isArray(response);

const mapProductRoleMappings = (
  mappings: ProductRolesApiResponse['roleMappings'],
  productId: string,
  partnerTechRole: boolean
): Array<ProductRole> =>
  mappings.flatMap((mapping) =>
    (mapping.productRoles ?? []).map((role) => ({
      productId,
      partyRole: mapping.partyRole as ProductRole['partyRole'],
      selcRole: mapping.selcRole as ProductRole['selcRole'],
      phasesAdditionAllowed: Array.from(mapping.phasesAdditionAllowed ?? []),
      multiroleGroups: Array.from(role.multiroleGroups ?? []),
      productRole: role.code ?? '',
      title: role.label ?? '',
      description: role.description ?? '',
      partnerTechRole,
    }))
  );

const getCurrentUserRoleContext = (
  currentUserRoles: ProductRolesApiResponse['currentUserRoles'] = []
): CurrentUserProductRoleContext => ({
  hasStandardRole: currentUserRoles.some((role) => role.partnerTechRole !== true),
  hasPartnerTechRole: currentUserRoles.some((role) => role.partnerTechRole === true),
});

export const fetchProducts = (): Promise<Array<Product>> => {
  /* istanbul ignore if */
  if (import.meta.env.VITE_API_MOCK_PRODUCTS === 'true') {
    return Promise.resolve(mockedPartyProducts);
  } else {
    return DashboardApi.getProducts().then((productResources) =>
      productResources ? productResources.map(productResource2Product) : []
    );
  }
};

export const fetchProductRoles = (product: Product, party: Party): Promise<Array<ProductRole>> => {
  const activeOnboardings = party.products.filter((p) => p.productOnBoardingStatus === 'ACTIVE');
  const institutionTypeOnActiveOnboarding =
    activeOnboardings.find((p) => p.productId === product.id)?.institutionType ?? '';

  /* istanbul ignore if */
  if (import.meta.env.VITE_API_MOCK_PRODUCTS === 'true') {
    return fetchProductRolesMocked(product, party);
  } else {
    return DashboardApi.getProductRoles(product.id, institutionTypeOnActiveOnboarding)
      .then((response) => {
        if (!isProductRolesApiResponse(response)) {
          return mapProductRoleMappings(response, product.id, false);
        }

        const standardRoles = mapProductRoleMappings(
          response.roleMappings,
          product.id,
          false
        );
        const partnerTechRoles = mapProductRoleMappings(
          response.partnerTechRoleMappings ?? [],
          product.id,
          true
        );

        return selectProductRolesForCurrentUser(
          standardRoles,
          partnerTechRoles,
          getCurrentUserRoleContext(response.currentUserRoles)
        );
      })
      .catch((reason) => reason);
  }
};
