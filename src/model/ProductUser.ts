import { ProductUserResource } from '../api/generated/b4f-dashboard/ProductUserResource';

export type ProductUser = {
  id: string;
  name: string;
  surname: string;
  taxCode: string;
  email: string;
};

export const productUserResource2ProductUser = (resource: ProductUserResource): ProductUser => ({
  id: resource.id ?? '',
  name: resource.name ?? '',
  surname: resource.surname ?? '',
  taxCode: resource.fiscalCode?.toUpperCase() ?? '',
  email: resource.email ?? '',
});
