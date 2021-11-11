import { PartyProcessApi } from '../api/PartyProcessApiClient';
import { institutionInfo2Party, Party } from '../model/Party';

export const fetchParties = (): Promise<Array<Party>> =>
  PartyProcessApi.getOnBoardingInfo().then((onBoardingInfo) =>
    onBoardingInfo.institutions ? onBoardingInfo.institutions.map(institutionInfo2Party) : []
  );

export const fetchPartyDetails = (
  institutionId: string,
  parties?: Array<Party>
): Promise<Party | null> => {
  const fetchPartyPromise: (institutionId: string) => Promise<Party | null> = process.env
    .REACT_APP_FETCH_SELECTED_PARTY_FROM_PARTY_PROCESS
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

const fetchPartyFromDashboardBE = (_institutionId: string): Promise<Party | null> =>
  new Promise((_resolve, error) => error('TO IMPLEMENT')); // TODO
