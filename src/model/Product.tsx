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
  allowMultipleRole: boolean;
};

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
  allowMultipleRole: false, // TODO
});
