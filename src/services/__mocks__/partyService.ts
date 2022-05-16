import { Party } from '../../model/Party';

export const mockedParties: Array<Party> = [
  {
    userRole: 'ADMIN',
    description: 'Comune di Bari',
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '1',
    digitalAddress: 'comune.bari@pec.it',
    fiscalCode: 'fiscalCodeBari',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    institutionType: 'PA',
  },
  {
    userRole: 'ADMIN',
    description: 'Comune di Milano',
    urlLogo: 'image',
    status: 'PENDING',
    partyId: '2',
    digitalAddress: 'comune.milano@pec.it',
    fiscalCode: 'fiscalCodeMilano',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId2',
    originId: 'originId2',
    origin: 'IPA',
    institutionType: 'PA',
  },
  {
    userRole: 'ADMIN',
    description: 'Comune di Roma',
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '3',
    digitalAddress: 'comune.roma@pec.it',
    fiscalCode: 'fiscalCodeRoma',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId3',
    originId: 'originId3',
    origin: 'IPA',
    institutionType: 'PA',
  },
  {
    userRole: 'LIMITED',
    description: 'Comune di Napoli',
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '4',
    digitalAddress: 'comune.napoli@pec.it',
    fiscalCode: 'fiscalCodeNapoli',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId4',
    originId: 'originId4',
    origin: 'IPA',
    institutionType: 'PA',
  },
  {
    userRole: 'ADMIN',
    description: 'AGENCY ONBOARDED',
    urlLogo: 'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/onboarded/logo.png',
    status: 'ACTIVE',
    partyId: 'onboarded',
    digitalAddress: 'comune.onboarded@pec.it',
    fiscalCode: 'fiscalCodeONBOARDED',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId5',
    originId: 'originId5',
    origin: 'MOCK',
    institutionType: 'GSP',
  },
];

export const verifyFetchPartiesMockExecution = (parties: Array<Party>) => {
  expect(parties).toStrictEqual(mockedParties);
};

export const fetchParties = () => new Promise((resolve) => resolve(mockedParties));

export const verifyFetchPartyDetailsMockExecution = (party: Party) => {
  expect(party).toStrictEqual(mockedParties.filter((p) => p.partyId === party.partyId)[0]);
};

export const fetchPartyDetails = (
  partyId: string,
  _parties?: Array<Party>
): Promise<Party | null> =>
  new Promise((resolve) => resolve(mockedParties.find((p) => p.partyId === partyId) ?? null));
