import { ProductsResource } from '../api/generated/b4f-dashboard/ProductsResource';

export type Product = {
  activationDateTime?: Date;
  description: string;
  id: string;
  logo?: string;
  title: string;
  urlBO: string;
  urlPublic?: string;
  tag?: string;
  userRole?: string;
  authorized?: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
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
  userRole: resource.userRole,
  authorized: resource.authorized,
  status: resource.status,
});
