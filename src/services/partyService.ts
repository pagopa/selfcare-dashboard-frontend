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

export const fetchPartyDetails = (
  institutionId: string,
  parties?: Array<Party>
): Promise<Party | null> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return new Promise((resolve) =>
      resolve(mockedParties.find((p) => p.institutionId === institutionId) ?? null)
    );
  }

  return retrieveParty(institutionId, parties);
};

// check inside parties as first
const retrieveParty = (
  institutionId: string,
  parties: Array<Party> | undefined
): Promise<Party | null> => {
  if (parties) {
    const selected = parties.filter((p) => p.institutionId === institutionId);
    if (selected && selected.length > 0) {
      return new Promise((resolve) => resolve(selected[0]));
    } else {
      return retrieveParty_fetch(institutionId);
    }
  } else {
    return retrieveParty_fetch(institutionId);
  }
};

const retrieveParty_fetch = (institutionId: string): Promise<Party | null> =>
  DashboardApi.getInstitution(institutionId).then((institutionResource) =>
    institutionResource ? institutionResource2Party(institutionResource) : null
  );
