import { StatusEnum } from '../../../../../api/generated/b4f-dashboard/SubProductResource';
import { OnboardedProduct } from '../../../../../model/Party';
import { Product, ProductInstitutionMap } from '../../../../../model/Product';
import { PRODUCT_IDS } from '../../../../../utils/constants';

type FilterConfig = {
  institutionTypesList: Array<string>;
  categoryCode?: string;
  allowedInstitutionTypes: ProductInstitutionMap;
};

const institutionTypeFilter = (
  productsWithStatusActive: Array<Product>,
  {
    institutionTypesList,
    categoryCode,
    allowedInstitutionTypes,
  }: FilterConfig & { institutionTypesList: Array<string> }
): Array<Product> =>
  productsWithStatusActive.filter((product) => {
    const allowedTypes = allowedInstitutionTypes[product.id] ?? allowedInstitutionTypes?.default;
    if (!allowedTypes) {
      return false;
    }

    // Check if any of the institution types are allowed
    return institutionTypesList?.some((type) => {
      const typeConfig = allowedTypes[type];
      if (!typeConfig) {
        return false;
      }

      if (typeConfig.categories) {
        const categoriesArray = (typeConfig.categories as string).split(',');
        return categoryCode ? categoriesArray.includes(categoryCode) : false;
      }

      return true;
    });
  });

const onboardingStatusFilter = (
  productsWithStatusActive: Array<Product>,
  onboardedProducts: Array<OnboardedProduct>,
  institutionTypesList: Array<string>
): Array<Product> => {
  const onboardedProductIds = new Set(onboardedProducts.map((p) => p.productId));

  return productsWithStatusActive.filter((product) => {
    const isOnboarded = onboardedProductIds.has(product.id ?? '');

    if (product.subProducts?.length) {
      return product.subProducts.some((child) => {
        const isChildOnboarded = onboardedProductIds.has(child.id ?? '');
        const isChildActive = child.status === StatusEnum.ACTIVE;
        // only psp can onboard on pagopa insights
        const isSpecialPSPCase =
          child.id === PRODUCT_IDS.PAGOPA_DASHBOARD_PSP && !institutionTypesList.includes('PSP');

        if (isOnboarded && !isChildOnboarded && isChildActive && isSpecialPSPCase) {
          return false;
        }
        // If the product is onboarded, we only want to show it if at least one child is active and not onboarded
        return !isChildOnboarded && isChildActive;
      });
    }
    // Exclude products that are already onboarded
    return !isOnboarded;
  });
};

/**
 * Applies all the filters in the correct order.
 *
 * @param productsWithStatusActive - The list of products to filter
 * @param filterByConfig - The filter configuration, including institution type, category code, etc.
 * @param onboardedProducts - The list of products that are already onboarded
 * @returns The filtered list of products
 */
export const filterProducts = (
  productsWithStatusActive: Array<Product>,
  filterByConfig: FilterConfig,
  onboardedProducts: Array<OnboardedProduct>
): Array<Product> => {
  const productsFilteredByInstitution = institutionTypeFilter(
    productsWithStatusActive,
    filterByConfig
  );

  return onboardingStatusFilter(
    productsFilteredByInstitution,
    onboardedProducts,
    filterByConfig.institutionTypesList
  );
};
