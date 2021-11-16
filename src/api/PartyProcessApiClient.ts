import { RequestParams } from '@pagopa/ts-commons/lib/requests';
import { storageRead } from '../utils/storage-utils';
import { STORAGE_KEY_TOKEN } from '../utils/constants';
import { createClient, WithDefaultsT } from './generated/party-process/client';
import { OnBoardingInfo } from './generated/party-process/OnBoardingInfo';
import { GetOnBoardingInfoT } from './generated/party-process/requestTypes';
import { buildFetchApi, extractResponse } from './api-utils';

const partyProcessBaseUrl = process.env.REACT_APP_URL_API_PARTY_PROCESS;
const partyProcessTimeoutMs = process.env.REACT_APP_API_PARTY_PROCESS_TIMEOUT_MS;

// TODO, there is not a bearer token at the moment?!?
const withBearer: WithDefaultsT<'_____'> = (wrappedOperation) => (params) => {
  const token = storageRead(STORAGE_KEY_TOKEN, 'string');
  return wrappedOperation({
    ...params,
    Bearer: token,
  });
};

const apiClient = createClient({
  baseUrl: partyProcessBaseUrl,
  basePath: '',
  fetchApi: buildFetchApi(partyProcessTimeoutMs),
  withDefaults: withBearer,
});

export const PartyProcessApi = {
  getOnBoardingInfo: async (
    request: RequestParams<GetOnBoardingInfoT> = {}
  ): Promise<OnBoardingInfo> => {
    const result = await apiClient.getOnBoardingInfo(request);
    return extractResponse(result, 200);
  },
};
