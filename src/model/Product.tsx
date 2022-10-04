import { ProductsResource } from '../api/generated/b4f-dashboard/ProductsResource';
import { UserRole } from './Party';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export type Product = {
  activationDateTime?: Date;
  description: string;
  id: string;
  logo: string;
  title: string;
  urlBO: string;
  urlTest?: string;
  urlPublic?: string;
  tag?: string;
  userRole?: UserRole;
  authorized?: boolean;
  status: ProductStatus;
  imageUrl: string;
  subProducts: Array<SubProduct>;
  logoBgColor?: string;
};

export type SubProduct = {
  id: string;
  title: string;
  status: ProductStatus;
};
export type ProductsMap = { [id: string]: Product };

export const buildProductsMap = (products: Array<Product>): ProductsMap =>
  products.reduce((acc, p) => {
    // eslint-disable-next-line functional/immutable-data
    acc[p.id] = p;
    return acc;
  }, {} as ProductsMap);

export const productResource2Product = (resource: ProductsResource): Product => ({
  activationDateTime: resource.activatedAt,
  description: resource.description,
  id: resource.id,
  logo: resource.logo,
  title: resource.title,
  urlBO: resource.urlBO,
  urlPublic: resource.urlPublic,
  tag: undefined,
  userRole: resource.userRole as UserRole,
  authorized: resource.authorized,
  status: resource.status,
  imageUrl: resource.imageUrl,
  subProducts: resource.children?.slice() ?? [],
  logoBgColor: resource.logoBgColor,
});
