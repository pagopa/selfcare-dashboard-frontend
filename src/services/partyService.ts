import { DashboardApi } from '../api/DashboardApiClient';
import { PartyProcessApi } from '../api/PartyProcessApiClient';
import { institutionInfo2Party, institutionResource2Party, Party } from '../model/Party';
import { ENV } from '../utils/env';

export const fetchParties = (): Promise<Array<Party>> =>
  PartyProcessApi.getOnBoardingInfo().then((onBoardingInfo) =>
    onBoardingInfo.institutions ? onBoardingInfo.institutions.map(institutionInfo2Party) : []
  );

export const fetchPartyDetails = (
  institutionId: string,
  parties?: Array<Party>
): Promise<Party | null> => {
  const fetchPartyPromise: (institutionId: string) => Promise<Party | null> =
    ENV.FETCH_SELECTED_PARTY_FROM_PARTY_PROCESS
      ? (institutionId) => fetchPartyFromPartyProcess(institutionId, parties)
      : fetchPartyFromDashboardBE;

  return fetchPartyPromise(institutionId);
};

// fetch using PartyProcess

const fetchPartyFromPartyProcess = (
  institutionId: string,
  parties: Array<Party> | undefined
): Promise<Party | null> => {
  if (parties) {
    const selected = parties.filter((p) => p.institutionId === institutionId);
    if (selected && selected.length > 0) {
      return new Promise((resolve) => resolve(selected[0]));
    } else {
      return fetchPartyFromPartyProcess_fetch(institutionId);
    }
  } else {
    return fetchPartyFromPartyProcess_fetch(institutionId);
  }
};

const fetchPartyFromPartyProcess_fetch = (institutionId: string): Promise<Party | null> =>
  PartyProcessApi.getOnBoardingInfo({ institutionId }).then((onBoardingInfo) =>
    onBoardingInfo.institutions && onBoardingInfo.institutions.length > 0
      ? institutionInfo2Party(onBoardingInfo.institutions[0])
      : null
  );

// fetch using Dashboard BE

const fetchPartyFromDashboardBE = (institutionId: string): Promise<Party | null> =>
  DashboardApi.getInstitution(institutionId).then((institutionResource) =>
    institutionResource ? institutionResource2Party(institutionResource) : null
  );
