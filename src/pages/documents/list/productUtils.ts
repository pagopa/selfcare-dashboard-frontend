import { ProductOnBoardingStatusEnum } from '../../../api/generated/b4f-dashboard/OnboardedProductResource';
import {
  StatusEnum,
  SubProductResource,
} from '../../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';

// TODO: common v2 lacks this action; use Actions.UpdateContract after upgrading common.
export const UPDATE_CONTRACT_ACTION = 'Selc:UpdateContract';

export type DocumentProduct = {
  product: Product | SubProductResource;
  productId: string;
  parentProduct: Product;
  parentProductId: string;
};

const isProductOnboarded = (party: Party, productId?: string) =>
  Boolean(
    productId &&
      party.products.some(
        (product) =>
          product.productId === productId &&
          product.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE
      )
  );

export const getDocumentProducts = (
  party: Party,
  products: Array<Product>,
  isPagoPaUser = false
): Array<DocumentProduct> =>
  products.flatMap((parentProduct) => {
    const activeSubProducts = (parentProduct.subProducts ?? []).flatMap((product) =>
      product.id &&
      (isPagoPaUser || product.contractEnabled) &&
      product.status === StatusEnum.ACTIVE &&
      isProductOnboarded(party, product.id)
        ? [
            {
              product,
              productId: product.id,
              parentProduct,
              parentProductId: parentProduct.id ?? product.id,
            },
          ]
        : []
    );

    if (activeSubProducts.length > 0) {
      return activeSubProducts;
    }

    return parentProduct.id &&
      (isPagoPaUser || parentProduct.contractEnabled) &&
      parentProduct.status === StatusEnum.ACTIVE &&
      isProductOnboarded(party, parentProduct.id)
      ? [
          {
            product: parentProduct,
            productId: parentProduct.id,
            parentProduct,
            parentProductId: parentProduct.id,
          },
        ]
      : [];
  });

export const getDocumentProductIds = (documentProducts: Array<DocumentProduct>): Array<string> =>
  Array.from(new Set(documentProducts.map(({ parentProductId }) => parentProductId)));
