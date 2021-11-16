import { ProductsResource } from '../api/generated/b4f-dashboard/ProductsResource';

export type Product = {
  activationDateTime?: Date;
  description?: string;
  id: string;
  logo?: string;
  title: string;
  urlBO?: string;
  urlPublic?: string;
  tag?: string;
  authorized?: boolean;
  active: boolean;
};

export const productResource2Product = (resource: ProductsResource): Product =>
  Object.assign({}, resource) as Product; // it will not provide tag: it will be undefined
