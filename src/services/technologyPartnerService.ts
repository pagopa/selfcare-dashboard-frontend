/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import { DashboardApi } from '../api/DashboardApiClient';
import { TypeEnum } from '../api/generated/b4f-dashboard/DelegationRequestDto';
import {
  DelegationWithInfo,
} from '../api/generated/b4f-dashboard/DelegationWithInfo';
import { DelegationWithPagination } from '../api/generated/b4f-dashboard/DelegationWithPagination';

function generateDelegationWithInfoArray(n: number): Array<DelegationWithInfo> {
  const delegationArray: Array<DelegationWithInfo> = [];
  let currentDate = new Date();

  for (let i = 0; i < n; i++) {
    const createdAt = new Date(currentDate);
    createdAt.setDate(currentDate.getDate() - i);

    const updatedAt = new Date(createdAt);
    updatedAt.setDate(createdAt.getDate() + 1);

    const delegation: DelegationWithInfo = {
      brokerId: `brokerId${i}`,
      brokerName: `Broker Name ${i}`,
      brokerTaxCode: `BrokerTaxCode${i}`,
      brokerType: `BrokerType${i}`,
      createdAt,
      id: `id${i}`,
      institutionId: `institutionId${i}`,
      institutionName: `Institution Name ${i}`,
      institutionRootName: `Institution Root Name ${i}`,
      institutionType: 'PA',
      productId: `prod-pagopa`,
      status: `Status${i}`,
      taxCode: `TaxCode${i}`,
      type: TypeEnum.EA,
      updatedAt,
    };

    delegationArray.push(delegation);

    currentDate = createdAt;
  }

  return delegationArray;
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
  delegations: generateDelegationWithInfoArray(101),
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
    return Promise.resolve(mockedDelegationsWithPagination);
  } else {
    return DashboardApi.getDelegatingInstitutions(partyId).then(
      (delegationsResource) => delegationsResource
    );
  }
};
