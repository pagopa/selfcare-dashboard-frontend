// src/pages/dashboard/useDashboardData.ts
import { usePermissions } from '@pagopa/selfcare-common-frontend';
import { Actions } from '@pagopa/selfcare-common-frontend/utils/constants';
import { useMemo } from 'react';
import { Party } from '../../../model/Party';
import { Product, ProductsMap, buildProductsMap } from '../../../model/Product';

type UseDashboardDataResult = {
  activeOnboardings: NonNullable<Party['products']>;
  productsMap: ProductsMap;
  activeProducts: Array<Product>;
  delegableProducts: Array<Product>;
  authorizedDelegableProducts: Array<Product>;
  isPTTheOnlyType: boolean;
  isPTOnAnyOnboarding: boolean;
  hasDelegation: boolean;
  // permission helpers from the hook's internal permission module
  getAllProductsWithPermission: (action: string) => Array<string>;
  hasPermission: (productId: string, action: string) => boolean;
};

/**
 * All derived/dashboard-specific data extracted into a hook for testability.
 */
export const useDashboardData = (
  party: Party | null | undefined,
  products: Array<Product> | null | undefined,
  institutionTypes: Array<string> | null | undefined
): UseDashboardDataResult => {
  const { getAllProductsWithPermission, hasPermission } = usePermissions();

  const activeOnboardings =
    party?.products?.filter((p) => p.productOnBoardingStatus === 'ACTIVE') ?? [];

  const productsMap: ProductsMap = useMemo(() => buildProductsMap(products ?? []), [products]);

  const activeProducts: Array<Product> = useMemo(
    () =>
      (products ?? []).filter((p) =>
        activeOnboardings.some((ap) => ap.productId === p.id && p.status !== 'INACTIVE')
      ),
    [products, activeOnboardings]
  );

  const delegableProducts: Array<Product> = useMemo(
    () =>
      activeProducts.filter((product) =>
        activeOnboardings.some(
          (partyProduct) => partyProduct.productId === product.id && product.delegable
        )
      ),
    [activeProducts, activeOnboardings]
  );

  const authorizedDelegableProducts: Array<Product> = useMemo(
    () =>
      delegableProducts.filter(
        (ap) =>
          hasPermission(ap.id ?? '', Actions.AccessProductBackoffice) &&
          activeOnboardings.some(
            (partyProduct) =>
              partyProduct.productId === ap.id && partyProduct.institutionType !== 'PT'
          )
      ),
    [delegableProducts, activeOnboardings, hasPermission]
  );

  const uniqueInstitutionTypesList = useMemo(
    () => [...new Set(institutionTypes ?? [])],
    [institutionTypes]
  );

  const isPTTheOnlyType =
    uniqueInstitutionTypesList.length === 1 && uniqueInstitutionTypesList.includes('PT');
  const isPTOnAnyOnboarding = (institutionTypes ?? []).includes('PT');
  const hasDelegation = Boolean(party?.delegation);

  return {
    activeOnboardings,
    productsMap,
    activeProducts,
    delegableProducts,
    authorizedDelegableProducts,
    isPTTheOnlyType,
    isPTOnAnyOnboarding,
    hasDelegation,
    getAllProductsWithPermission,
    hasPermission,
  };
};
