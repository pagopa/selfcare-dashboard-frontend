import { Party } from '../../model/Party';

export const mockedParties: Array<Party> = [
  {
    role: 'Manager',
    description: 'Comune di Bari',
    urlLogo: 'image',
    status: 'Pending',
    institutionId: '1',
    digitalAddress: '',
    platformRole: 'admin',
  },
  {
    role: 'Manager',
    description: 'Comune di Milano',
    urlLogo: 'image',
    status: 'Pending',
    institutionId: '2',
    digitalAddress: '',
    platformRole: 'admin',
  },
  {
    role: 'Manager',
    description: 'Comune di Roma',
    urlLogo: 'image',
    status: 'Active',
    institutionId: '3',
    digitalAddress: '',
    platformRole: 'admin',
  },
  {
    role: 'Manager',
    description: 'Comune di Napoli',
    urlLogo: 'image',
    status: 'Active',
    institutionId: '4',
    digitalAddress: '',
    platformRole: 'admin',
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
