import { ProductsResource } from '../api/generated/b4f-dashboard/ProductsResource';

export type Product = {
  activationDateTime?: Date;
  description: string;
  id: string;
  code: string;
  logo?: string;
  title: string;
  urlBO: string;
  urlPublic?: string;
  tag?: string;
  authorized?: boolean;
  active: boolean;
};

export const productResource2Product = (resource: ProductsResource): Product => ({
  activationDateTime: resource.activatedAt,
  description: resource.description,
  id: resource.id,
  code: resource.code,
  logo: resource.logo,
  title: resource.title,
  urlBO: resource.urlBO,
  urlPublic: resource.urlPublic,
  tag: undefined,
  authorized: resource.authorized,
  active: resource.active,
});
