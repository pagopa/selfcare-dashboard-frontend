import { fetchParties, fetchPartyDetails } from '../partyService';
import { institutionResource2Party, Party } from '../../model/Party';
import { DashboardApi } from '../../api/DashboardApiClient';
import { mockedInstitutionResources } from '../../api/__mocks__/DashboardApiClient';

jest.mock('../../api/DashboardApiClient');

let dashboardApiGetInstitutionSpy;
let dashboardApiGetInstitutionsSpy;

beforeEach(() => {
  dashboardApiGetInstitutionSpy = jest.spyOn(DashboardApi, 'getInstitution');
  dashboardApiGetInstitutionsSpy = jest.spyOn(DashboardApi, 'getInstitutions');
});

test('Test fetchParties', async () => {
  const parties = await fetchParties();

  expect(parties).toMatchObject(mockedInstitutionResources.map(institutionResource2Party));

  parties.forEach((p) =>
    expect(p.urlLogo).toBe(
      `https://selcdcheckoutsa.z6.web.core.windows.net/institutions/${p.institutionId}/logo.png`
    )
  );

  expect(dashboardApiGetInstitutionsSpy).toBeCalledTimes(1);
});

describe('Test fetchPartyDetails', () => {
  const expectedInstitutionId: string = '1';

  const checkSelectedParty = (party: Party) => {
    expect(party).toMatchObject(institutionResource2Party(mockedInstitutionResources[0]));

    expect(party.urlLogo).toBe(
      `https://selcdcheckoutsa.z6.web.core.windows.net/institutions/${expectedInstitutionId}/logo.png`
    );
  };

  const checkDashboardInvocation = (expectedCallsNumber: number) => {
    expect(DashboardApi.getInstitution).toBeCalledTimes(expectedCallsNumber);
    if (expectedCallsNumber > 0) {
      expect(DashboardApi.getInstitution).toBeCalledWith(expectedInstitutionId);
    }
  };

  test('Test no parties as cache', async () => {
    const party = await fetchPartyDetails(expectedInstitutionId);
    checkSelectedParty(party);

    checkDashboardInvocation(1);
  });

  test('Test parties as cache', async () => {
    const parties = mockedInstitutionResources.map(institutionResource2Party);
    const party = await fetchPartyDetails(expectedInstitutionId, parties);
    checkSelectedParty(party);

    checkDashboardInvocation(0);

    const partialParties = parties.filter((p) => p.institutionId !== expectedInstitutionId);
    const party2 = await fetchPartyDetails(expectedInstitutionId, partialParties);
    expect(party2).toStrictEqual(party);

    checkDashboardInvocation(1);
  });
});
