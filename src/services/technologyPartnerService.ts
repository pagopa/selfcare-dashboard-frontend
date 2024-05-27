/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import { DashboardApi } from '../api/DashboardApiClient';
import { TypeEnum } from '../api/generated/b4f-dashboard/DelegationRequestDto';
import { DelegationWithInfo } from '../api/generated/b4f-dashboard/DelegationWithInfo';
import { DelegationWithPagination } from '../api/generated/b4f-dashboard/DelegationWithPagination';

function generateTechPartners(numPartners: number) {
  const usedIds = new Set(); // Track used IDs for uniqueness
  const usedBrokerIds = new Set(); // Track used broker IDs for uniqueness

  const techPartners = [];
  for (let i = 0; i < numPartners; i++) {
    let uniqueId = generateUniqueString(10); // Generate unique ID
    while (usedIds.has(uniqueId)) {
      uniqueId = generateUniqueString(10); // Re-generate if used
    }
    usedIds.add(uniqueId);

    let uniqueBrokerId = generateUniqueString(10); // Generate unique broker ID
    while (usedBrokerIds.has(uniqueBrokerId)) {
      uniqueBrokerId = generateUniqueString(10); // Re-generate if used
    }
    usedBrokerIds.add(uniqueBrokerId);

    techPartners.push({
      brokerId: uniqueBrokerId,
      brokerName: `Comune di City-${i + 1}`,
      id: uniqueId,
      institutionId: 'placeholder-institutionId',
      institutionName: `Comune di ${i + 1}`,
      institutionRootName: '',
      productId: Math.random() > 0.5 ? 'prod-io' : 'prod-pagopa',
      type: 'PT' as TypeEnum,
      taxCode: `IT${generateUniqueString(11)}`,
      createdAt: new Date(),
    });
  }

  return techPartners;
}

function generateUniqueString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const mockedTechPartner: Array<DelegationWithInfo> = [
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e67-9c06-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Ascrea',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3886ccd3b0ab',
    // id dell'ente delegante
    institutionId: '072b11f1-5bca-4fc5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Nuoro',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-io',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e67-9c06-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Ascrea',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3886ccd3b0ab',
    // id dell'ente delegante
    institutionId: '072b11f1-5bca-4fc5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Nuoro',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-pagopa',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '04f05ae5-dfac-4e67-9c06-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Roma',
    // id oggetto delega (?)
    id: '8aaee6e3-f0f7-4eb3-b584-3886ccd3b0ab',
    // id dell'ente delegante
    institutionId: '072c11f1-5bca-4fc5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Milano',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-io',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e68-9c06-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Napoli',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3896ccd3b0ab',
    // id dell'ente delegante
    institutionId: '072b11f1-5bca-4fc6-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Genova',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-io',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e67-9c36-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Pescara',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3886ccd3b0att',
    // id dell'ente delegante
    institutionId: '072b11f1-5bca-4fu5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Livorno',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-io',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e67-9c06-82c0d2a80fd3',
    // nome ente delegato
    brokerName: 'Comune di Messina',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3886ccd3b0au',
    // id dell'ente delegante
    institutionId: '072b11f1-5bc5-4fc5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Viterbo',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-pagopa',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfre-4e67-9c06-82c0d2a80fd3',
    // nome ente delegato
    brokerName: 'Comune di Bari',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b585-3886ccd3b0au',
    // id dell'ente delegante
    institutionId: '072b11f1-1bc5-4fc5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Pomezia',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-pagopa',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfyy-4e67-9c06-82c0d2a80fd3',
    // nome ente delegato
    brokerName: 'Comune di Lucca',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b577-3886ccd3b0au',
    // id dell'ente delegante
    institutionId: '072b11f1-1bc5-8ic5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Spoleto',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-pagopa',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e67-9c06-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Ascrea',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3886ccd3b0ab',
    // id dell'ente delegante
    institutionId: '072b11f1-5bca-4fc5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Aomune di Test',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-pagopa',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '04f05ae5-dfac-4e67-9c06-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Roma',
    // id oggetto delega (?)
    id: '8aaee6e3-f0f7-4eb3-b584-3886ccd3b0ab',
    // id dell'ente delegante
    institutionId: '072b11f1-5bca-4fc5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Milano',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-io',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e68-9c06-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Napoli',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3896ccd3b0ab',
    // id dell'ente delegante
    institutionId: '072b11f1-5bca-4fc5-9fe2-2c646f51e4bf',
    // nome ente delegante
    institutionName: 'Comune di Genova',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-io',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e67-9c36-82c0d2a89fd3',
    // nome ente delegato
    brokerName: 'Comune di Pescara',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3886ccd3b0att',
    // id dell'ente delegante
    institutionId: '98123',
    // nome ente delegante
    institutionName: 'Comune di Livorno',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-io',
    type: 'PT' as TypeEnum,
  },
  {
    // id partner delegato
    brokerId: '07f05ae5-dfac-4e67-9c06-82c0d2a80fd3',
    // nome ente delegato
    brokerName: 'Comune di Messina',
    // id oggetto delega (?)
    id: '8aaff6e3-f0f7-4eb3-b584-3886ccd3b0au',
    // id dell'ente delegante
    institutionId: '98123',
    // nome ente delegante
    institutionName: 'Comune di Viterbo',
    // nome dell'ente centrale se fosse gestita la relazione con aoo/uo (?)
    institutionRootName: '',
    // id del prodotto
    productId: 'prod-pagopa',
    type: 'PT' as TypeEnum,
  },
];

export const mockedDelegationsWithPagination: DelegationWithPagination = {
  delegations: generateTechPartners(50),
  pageInfo: {
    pageNo: 0,
    pageSize: 10,
    totalElements: 4,
    totalPages: 1,
  },
};

export const getDelegatingInstitutions = (partyId: string): Promise<DelegationWithPagination> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
    return new Promise((resolve) => {
      resolve(mockedDelegationsWithPagination);
    });
  } else {
    return DashboardApi.getDelegatingInstitutions(partyId).then(
      (delegationsResource) => delegationsResource
    );
  }
};
