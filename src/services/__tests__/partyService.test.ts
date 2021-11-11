import { mockedOnBoardingInfo } from '../../api/__mocks__/PartyProcessApiClient';
import { PartyProcessApi } from '../../api/PartyProcessApiClient';
import { fetchParties, fetchPartyDetails } from '../partyService';
import { institutionInfo2Party, Party } from '../../model/Party';

jest.mock('../../api/PartyProcessApiClient');

let partyProcessApiGetOnBoardingInfoSpy;

beforeEach(() => {
  partyProcessApiGetOnBoardingInfoSpy = jest.spyOn(PartyProcessApi, 'getOnBoardingInfo');
});

test('Test fetchParties', async () => {
  const parties = await fetchParties();

  expect(
    parties.map((p) => {
      const clone = Object.assign({}, p);
      delete clone.urlLogo;
      return clone;
    })
  ).toMatchObject(mockedOnBoardingInfo.institutions);

  parties.forEach((p) =>
    expect(p.urlLogo).toBe(
      `https://selcdcheckoutsa.z6.web.core.windows.net/institutions/${p.institutionId}/logo.png`
    )
  );

  expect(PartyProcessApi.getOnBoardingInfo).toBeCalledTimes(1);
});

describe('Test fetchPartyDetails', () => {
  const expectedInstitutionId: string = '1';
  let fetchMocks: Array<jest.SpyInstance>;

  beforeEach(() => {
    fetchMocks = [partyProcessApiGetOnBoardingInfoSpy];
  });

  const checkSelectedParty = (party: Party) => {
    const clonedParty = Object.assign({}, party);
    delete clonedParty.urlLogo;

    expect(clonedParty).toMatchObject(mockedOnBoardingInfo.institutions[0]);

    expect(party.urlLogo).toBe(
      `https://selcdcheckoutsa.z6.web.core.windows.net/institutions/${expectedInstitutionId}/logo.png`
    );
  };

  const checkMockInvocation = (expectedCallsNumber: number) => {
    expect(fetchMocks.reduce((sum, m) => sum + m.mock.calls.length, 0)).toBe(expectedCallsNumber);
  };

  const checkPartyProcessInvocation = () => {
    expect(PartyProcessApi.getOnBoardingInfo).toBeCalledTimes(1);
    expect(PartyProcessApi.getOnBoardingInfo).toBeCalledWith({
      institutionId: expectedInstitutionId,
    });
  };

  describe('Test no parties as cache', () => {
    const baseTestWhenNoParties = async () => {
      const party = await fetchPartyDetails(expectedInstitutionId);
      checkSelectedParty(party);

      checkMockInvocation(1);
    };

    test('Test default behavior when no parties', async () => {
      await baseTestWhenNoParties();

      checkPartyProcessInvocation();
    });

    test('Test PartyProcess configuration when no parties', async () => {
      process.env.REACT_APP_FETCH_SELECTED_PARTY_FROM_PARTY_PROCESS = 'true';
      await baseTestWhenNoParties();

      checkPartyProcessInvocation();
    });
  });

  describe('Test parties as cache', () => {
    const baseTestWhenPartiesInStore = async (expectedPartiesAsCache: boolean) => {
      const parties = mockedOnBoardingInfo.institutions.map(institutionInfo2Party);

      const party = await fetchPartyDetails(expectedInstitutionId, parties);
      checkSelectedParty(party);

      const expectedCalls = expectedPartiesAsCache ? 0 : 1;
      checkMockInvocation(expectedCalls);

      const partialParties = parties.filter((p) => p.institutionId !== expectedInstitutionId);
      const party2 = await fetchPartyDetails(expectedInstitutionId, partialParties);
      expect(party2).toStrictEqual(party);

      checkMockInvocation(expectedCalls + 1);
    };

    test('Test default behavior when parties in store', async () => {
      await baseTestWhenPartiesInStore(true);

      checkPartyProcessInvocation();
    });

    test('Test PartyProcess configuration when parties in store', async () => {
      process.env.REACT_APP_FETCH_SELECTED_PARTY_FROM_PARTY_PROCESS = 'true'; //TODO fixme is a boolean
      await baseTestWhenPartiesInStore(true);

      checkPartyProcessInvocation();
    });
  });
});
