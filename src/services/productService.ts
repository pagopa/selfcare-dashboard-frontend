import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import { Product, productResource2Product } from '../model/Product';
import { ProductRole } from '../model/ProductRole';
import {
  fetchProductRoles as fetchProductRolesMocked,
  mockedPartyProducts,
} from './__mocks__/productService';

export const fetchProducts = (): Promise<Array<Product>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
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
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
    return fetchProductRolesMocked(product, party);
  } else {
    return DashboardApi.getProductRoles(product.id, institutionTypeOnActiveOnboarding)
      .then((roles) =>
        roles
          ?.map((pr) =>
            pr?.productRoles?.map((r) => ({
              productId: product.id,
              partyRole: pr.partyRole,
              selcRole: pr.selcRole,
              multiroleAllowed: pr.multiroleAllowed,
              phasesAdditionAllowed: pr.phasesAdditionAllowed,
              productRole: r.code ?? '',
              title: r.label ?? '',
              description: r.description ?? '',
            }))
          )
          .flatMap((x) => x)
      )
      .catch((reason) => reason);
  }
};
