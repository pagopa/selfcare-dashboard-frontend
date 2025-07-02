import { StatusEnum } from '../../../../../api/generated/b4f-dashboard/SubProductResource';
import { OnboardedProduct } from '../../../../../model/Party';
import { Product, ProductInstitutionMap } from '../../../../../model/Product';
import { PRODUCT_IDS } from '../../../../../utils/constants';

type FilterConfig = {
  institutionType: string;
  categoryCode?: string;
  allowedInstitutionTypes: ProductInstitutionMap;
};

const institutionTypeFilter = (
  productsWithStatusActive: Array<Product>,
  { institutionType, categoryCode, allowedInstitutionTypes }: FilterConfig
): Array<Product> =>
  productsWithStatusActive.filter((product) => {
    // Check if product is allowed for the institution type
    const allowedTypes = allowedInstitutionTypes[product.id] ?? allowedInstitutionTypes?.default;
    if (!allowedTypes || !allowedTypes?.[institutionType]) {
      return false;
    }

    // If categories are required, check if the institution's category is in the allowed list
    if (allowedTypes[institutionType].categories) {
      const categories = categoryCode && (allowedTypes[institutionType].categories as string);
      const categoriesArray = categories?.split(',');
      return categoriesArray && categoryCode ? categoriesArray.includes(categoryCode) : false;
    }

    return true;
  });

const onboardingStatusFilter = (
  productsWithStatusActive: Array<Product>,
  onboardedProducts: Array<OnboardedProduct>,
  institutionType: string
): Array<Product> => {
  const onboardedProductIds = onboardedProducts.map((p) => p.productId);

  return productsWithStatusActive.filter((product) => {
    // For productsWithStatusActive with active base version, show eligible children
    if (product.subProducts && product.subProducts?.length > 0) {
      return product.subProducts.some((child) => {
        if (
          onboardedProductIds.includes(product.id ?? '') &&
          !onboardedProductIds.includes(child.id ?? '') &&
          child.status === StatusEnum.ACTIVE &&
          child.id === PRODUCT_IDS.PAGOPA_DASHBOARD_PSP &&
          institutionType !== 'PSP'
        ) {
          return false;
        }

        return !onboardedProductIds.includes(child.id ?? '') && child.status === StatusEnum.ACTIVE;
      });
    }

    // Exclude productsWithStatusActive that are already onboarded
    return !onboardedProductIds.includes(product.id);
  });
};

/**
 * Applies all the filters in the correct order.
 *
 * @param productsWithStatusActive - The list of products to filter
 * @param config - The filter configuration, including institution type, category code, etc.
 * @param onboardedProducts - The list of products that are already onboarded
 * @returns The filtered list of products
 */
export const filterProducts = (
  productsWithStatusActive: Array<Product>,
  config: FilterConfig,
  onboardedProducts: Array<OnboardedProduct>
): Array<Product> => {
  const productsFilteredByInstitution = institutionTypeFilter(productsWithStatusActive, config);

  return onboardingStatusFilter(
    productsFilteredByInstitution,
    onboardedProducts,
    config.institutionType
  );
};
