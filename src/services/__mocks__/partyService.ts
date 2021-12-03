import { Party } from '../../model/Party';

export const mockedParties: Array<Party> = [
  {
    role: 'MANAGER',
    description: 'Comune di Bari',
    urlLogo: 'image',
    status: 'PENDING',
    institutionId: '1',
    digitalAddress: '',
    platformRole: 'ADMIN_REF',
  },
  {
    role: 'MANAGER',
    description: 'Comune di Milano',
    urlLogo: 'image',
    status: 'PENDING',
    institutionId: '2',
    digitalAddress: '',
    platformRole: 'ADMIN_REF',
  },
  {
    role: 'MANAGER',
    description: 'Comune di Roma',
    urlLogo: 'image',
    status: 'ACTIVE',
    institutionId: '3',
    digitalAddress: '',
    platformRole: 'ADMIN_REF',
  },
  {
    role: 'MANAGER',
    description: 'Comune di Napoli',
    urlLogo: 'image',
    status: 'ACTIVE',
    institutionId: '4',
    digitalAddress: '',
    platformRole: 'TECH_REF',
  },
  {
    role: 'MANAGER',
    description: 'AGENCY ONBOARDED',
    urlLogo: 'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/onboarded/logo.png',
    status: 'ACTIVE',
    institutionId: 'onboarded',
    digitalAddress: '',
    platformRole: 'ADMIN_REF',
  },
];

export const verifyFetchPartiesMockExecution = (parties: Array<Party>) => {
  expect(parties).toStrictEqual(mockedParties);
};

export const fetchParties = () => new Promise((resolve) => resolve(mockedParties));

export const verifyFetchPartyDetailsMockExecution = (party: Party) => {
  expect(party).toStrictEqual(
    mockedParties.filter((p) => p.institutionId === party.institutionId)[0]
  );
};

export const fetchPartyDetails = (
  institutionId: string,
  _parties?: Array<Party>
): Promise<Party | null> =>
  new Promise((resolve) =>
    resolve(mockedParties.find((p) => p.institutionId === institutionId) ?? null)
  );
