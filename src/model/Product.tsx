import { ProductsResource } from '../api/generated/b4f-dashboard/ProductsResource';

export type Product = {
  activationDateTime?: Date;
  description: string;
  id: string;
  code: string; // TODO to remove?
  logo?: string;
  title: string;
  urlBO: string;
  urlPublic?: string;
  tag?: string;
  userRole?: string;
  authorized?: boolean;
  active: boolean;
  status?: string; // TODO to be remove later on ?
};

export const productResource2Product = (resource: ProductsResource): Product => ({
  activationDateTime: resource.activatedAt,
  description: resource.description,
  id: resource.id,
  code: resource.id,
  logo: resource.logo,
  title: resource.title,
  urlBO: resource.urlBO,
  urlPublic: resource.urlPublic,
  tag: undefined,
  userRole: resource.userRole,
  authorized: resource.authorized,
  active: resource.active,
});
