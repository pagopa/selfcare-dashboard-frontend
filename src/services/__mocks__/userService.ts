import { ProductUser } from '../../model/ProductUser';

// 'UID' is the uid of the mocked logged user; RSSMRA80A01H501U is used as Legal Representative in tests
export const mockedProductAdmins: Array<ProductUser> = [
  {
    id: 'UID',
    name: 'Laura',
    surname: 'Neri',
    taxCode: 'NRELRA90C50L219F',
    email: 'laura.neri@comune.it',
  },
  {
    id: 'user-2',
    name: 'Giulio',
    surname: 'Bianchi',
    taxCode: 'BNCGLI80A01H501Y',
    email: 'giulio.bianchi@comune.it',
  },
  {
    id: 'user-3',
    name: 'Mario',
    surname: 'Rossi',
    taxCode: 'RSSMRA80A01H501U',
    email: 'mario.rossi@comune.it',
  },
];

export const fetchProductAdmins = (
  _institutionId: string,
  _productId: string
): Promise<Array<ProductUser>> => Promise.resolve(mockedProductAdmins);
