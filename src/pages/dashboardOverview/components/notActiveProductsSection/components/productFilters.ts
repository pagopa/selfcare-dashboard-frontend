import { OnboardedProduct } from '../../../../../api/generated/b4f-dashboard/OnboardedProduct';
import { OnboardedProductResource } from '../../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { StatusEnum } from '../../../../../api/generated/b4f-dashboard/SubProductResource';
import { Product, ProductInstitutionMap } from '../../../../../model/Product';

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
  onboardedProducts: Array<OnboardedProductResource>
): Array<Product> => {
  const onboardedProductIds = onboardedProducts.map((p) => p.productId);

  return productsWithStatusActive.filter((product) => {
    // For productsWithStatusActive with active base version, show eligible children
    if (product.subProducts && product.subProducts?.length > 0) {
      return product.subProducts.some(
        (child) =>
          !onboardedProductIds.includes(child.id ?? '') && child.status === StatusEnum.ACTIVE
      );
    }

    // Exclude productsWithStatusActive that are already onboarded
    return !onboardedProductIds.includes(product.id);
  });
};

/**
 * Applies all the product filters in the correct order.
 * @param productsWithStatusActive - The list of productsWithStatusActive to filter
 * @param config - The filter configuration, including institution type, category code, and allowed product types
 * @param onboardedProducts - The list of productsWithStatusActive that are already onboarded for the institution
 * @returns The filtered list of productsWithStatusActive
 */
export const filterProducts = (
  productsWithStatusActive: Array<Product>,
  config: FilterConfig,
  onboardedProducts: Array<OnboardedProduct>
): Array<Product> =>
  onboardingStatusFilter(
    institutionTypeFilter(productsWithStatusActive, config),
    onboardedProducts
  );
