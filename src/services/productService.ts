import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product, productResource2Product } from '../model/Product';
import { ProductRole } from '../model/ProductRole';
import { ProductRolesApiResponse } from '../model/ProductRolesApiResponse';
import {
  fetchProductRoles as fetchProductRolesMocked,
  mockedPartyProducts,
} from './__mocks__/productService';

const mapProductRoleMappings = (
  mappings: ProductRolesApiResponse['roleMappings'],
  productId: string,
  isPartnerTech = false
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
      ...(isPartnerTech ? { isPartnerTech: true } : {}),
    }))
  );

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
      .then((response: ProductRolesApiResponse) => {
        const onboarding = activeOnboardings.find((p) => p.productId === product.id);
        const standardMappings = response.roleMappings;
        const partnerTechMappings = response.partnerTechRoleMappings ?? [];
        if (onboarding?.partnerTechRolesEnabled === true && onboarding.userPartnerTechRole === true) {
          return mapProductRoleMappings(partnerTechMappings, product.id, true);
        }

        return [
          ...mapProductRoleMappings(standardMappings, product.id),
          ...(onboarding?.partnerTechRolesEnabled === true
            ? mapProductRoleMappings(partnerTechMappings, product.id, true)
            : []),
        ];
      })
      .catch((reason) => reason);
  }
};
