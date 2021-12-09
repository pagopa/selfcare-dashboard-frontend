import { UserRole, UserStatus } from './Party';
import { Product } from './Product';

export type Role = {
  id: string;
  name: string;
  surname: string;
  taxCode: string;
  email: string;
  userRole: UserRole;
  products: Array<Product>;
  status: UserStatus;
};
