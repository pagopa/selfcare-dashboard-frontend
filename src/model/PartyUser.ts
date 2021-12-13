import { UserRole, UserStatus } from './Party';
import { Product } from './Product';

export type PartyUser = {
  id: string;
  name: string;
  surname: string;
  taxCode: string;
  email: string;
  userRole: UserRole;
  products: Array<Product>;
  status: UserStatus;
};

export type PartyUserOnCreation = {
  name: string;
  surname: string;
  taxCode: string;
  email: string;
  productRole : string;
};
