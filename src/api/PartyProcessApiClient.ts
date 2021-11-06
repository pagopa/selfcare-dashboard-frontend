import { agent } from '@pagopa/ts-commons';
import { AbortableFetch, setFetchTimeout, toFetch } from '@pagopa/ts-commons/lib/fetch';
import {
  ApiRequestType,
  IResponseType,
  RequestParams,
  TypeofApiResponse,
} from '@pagopa/ts-commons/lib/requests';
import { Millisecond } from '@pagopa/ts-commons/lib/units';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { createClient, WithDefaultsT } from './generated/party-process/client';
import { OnBoardingInfo } from './generated/party-process/OnBoardingInfo';
import { GetOnBoardingInfoT } from './generated/party-process/requestTypes';

const partyProcessBaseUrl = process.env.REACT_APP_URL_API_PARTY_PROCESS;
const partyProcessTimeoutMs = process.env.REACT_APP_API_PARTY_PROCESS_TIMEOUT_MS
  ? process.env.REACT_APP_API_PARTY_PROCESS_TIMEOUT_MS
  : 300000;

// Must be an https endpoint so we use an https agent
const abortableFetch = AbortableFetch(agent.getHttpFetch(process.env));
const fetchWithTimeout = toFetch(
  setFetchTimeout(partyProcessTimeoutMs as Millisecond, abortableFetch)
);
// tslint:disable-next-line: no-any
const fetchApi: typeof fetchWithTimeout = fetch as any as typeof fetchWithTimeout;

// TODO, there is not a bearer token at the moment?!?
const withBearer: WithDefaultsT<'_____'> = (wrappedOperation) => (params) => {
  const token = 'VALID_TOKEN'; // TODO retrieve last valid token
  return wrappedOperation({
    ...params,
    Bearer: token,
  });
};

const apiClient = createClient({
  baseUrl: partyProcessBaseUrl,
  basePath: '',
  fetchApi,
  withDefaults: withBearer,
});

const extractValue = async <S extends number, R>(
  response: t.Validation<
    TypeofApiResponse<ApiRequestType<any, any, any, IResponseType<any, any, any>>>
  >,
  successHttpStatus: S,
  type: t.Decoder<unknown, R>
): Promise<R> => {
  if (isRight(response)) {
    if (response.right.status === successHttpStatus) {
      const value = response.right.value;
      const validationResult = type.decode(value);
      if (isLeft(validationResult)) {
        console.error(response.right);
        console.error(validationResult.left);
        throw new Error(
          'The object obtained is not valid!' +
            typeof value.right +
            ' cannot be decoded by ' +
            type.name
        );
      }
      return value;
    } else {
      // TODO handle token expiration
      console.error(response.right);
      throw new Error('Something gone wrong while fetching ' + type.name);
    }
  } else {
    console.error(response.left);
    throw new Error('Something gone wrong while fetching ' + type.name);
  }
};

export const getOnBoardingInfo = async (
  request: RequestParams<GetOnBoardingInfoT>
): Promise<OnBoardingInfo> => {
  const result = await apiClient.getOnBoardingInfo(request);
  return extractValue(result, 400, OnBoardingInfo.asDecoder());
};
