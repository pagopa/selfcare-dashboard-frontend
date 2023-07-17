import { ProductsResource } from '../api/generated/b4f-dashboard/ProductsResource';
import {
  ProductOnBoardingStatusEnum,
  StatusEnum,
} from '../api/generated/b4f-dashboard/SubProductResource';

import { UserRole } from './Party';

export type Product = {
  activationDateTime?: Date;
  description: string;
  id: string;
  logo: string;
  title: string;
  urlBO: string;
  backOfficeEnvironmentConfigurations?: Array<{
    environment?: string;
    url?: string;
  }>;
  urlPublic?: string;
  tag?: string;
  userRole?: UserRole;
  authorized?: boolean;
  // onboarding status of product. Products that have, or have not, completed the onboarding process.
  productOnBoardingStatus: ProductOnBoardingStatusEnum;
  // product status.The intrinsic state of the product. Product status is unrelated to product onboarding status.
  status: StatusEnum;
  imageUrl: string;
  subProducts: Array<SubProduct>;
  logoBgColor?: string;
};

export type SubProduct = {
  id?: string;
  title?: string;
  productOnBoardingStatus?: ProductOnBoardingStatusEnum;
  status?: StatusEnum;
  description?: string;
  imageUrl?: string;
  logo?: string;
  logoBgColor?: string;
  urlPublic?: string;
};
export type ProductsMap = { [id: string]: Product };

export const buildProductsMap = (products: Array<Product>): ProductsMap =>
  products.reduce((acc, p) => {
    // eslint-disable-next-line functional/immutable-data
    acc[p.id] = p;
    return acc;
  }, {} as ProductsMap);

export const productResource2Product = (resource: ProductsResource): Product => ({
  authorized: resource.authorized,
  description: resource.description ?? '',
  id: resource.id ?? '',
  imageUrl: resource.imageUrl ?? '',
  logo: resource.logo ?? '',
  activationDateTime: resource.activatedAt,
  productOnBoardingStatus: resource.productOnBoardingStatus ?? ProductOnBoardingStatusEnum.INACTIVE,
  status: resource.status ?? StatusEnum.INACTIVE,
  title: resource.title ?? '',
  urlBO: resource.urlBO ?? '',
  backOfficeEnvironmentConfigurations: resource.backOfficeEnvironmentConfigurations?.slice(),
  logoBgColor: resource.logoBgColor,
  urlPublic: resource.urlPublic,
  tag: undefined,
  userRole: resource.userRole as UserRole,
  subProducts: resource.children?.slice() ?? [],
});
