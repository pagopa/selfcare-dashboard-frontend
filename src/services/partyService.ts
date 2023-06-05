import { DashboardApi } from '../api/DashboardApiClient';
import { institutionResource2Party, Party } from '../model/Party';
import { mockedParties } from './__mocks__/partyService';

export const fetchParties = (): Promise<Array<Party>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) => resolve(mockedParties));
  } else {
    return DashboardApi.getInstitutions().then((institutionResources) =>
      institutionResources ? institutionResources.map(institutionResource2Party) : []
    );
  }
};

export const fetchPartyDetails = (partyId: string): Promise<Party | null> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) =>
      resolve(mockedParties.find((p) => p.partyId === partyId) ?? null)
    );
  }

  return retrieveParty_fetch(partyId);
};

const retrieveParty_fetch = (partyId: string): Promise<Party | null> =>
  DashboardApi.getInstitution(partyId).then((institutionResource) =>
    institutionResource ? institutionResource2Party(institutionResource) : null
  );
