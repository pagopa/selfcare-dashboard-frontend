import type { ProductContractUpdateStatus } from '../contractUpdateService';

export const mockedProductContractUpdateStatuses: Array<ProductContractUpdateStatus> = [
  {
    productId: 'prod-io',
    contractUpdateRequired: true,
    contractUpdateInProgress: false,
  },
  {
    productId: 'prod-pagopa',
    contractUpdateRequired: true,
    contractUpdateInProgress: true,
  },
];
