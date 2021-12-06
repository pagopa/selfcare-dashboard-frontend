import { UserPlatformRole } from './Party';
import { Product } from './Product';

export type Role = {
  id: string;
  name: string;
  surname: string;
  taxCode: string;
  email: string;
  // role:UserRole TODO
  platformRole: UserPlatformRole;
  products: Array<Product>;
  status: 'ACTIVE' | 'SUSPENDED'; // TODO: To verify values
};
