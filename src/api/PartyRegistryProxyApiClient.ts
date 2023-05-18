import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/party-registry-proxy/client';
import { GeographicTaxonomyResource } from './generated/party-registry-proxy/GeographicTaxonomyResource';

const withBearerAndPartyId: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    bearerAuth: `Bearer ${token}`,
  });
};

const apiClient = createClient({
  baseUrl: ENV.URL_API.PARTY_REGISTRY_PROXY,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.DASHBOARD),
  withDefaults: withBearerAndPartyId,
});

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: i18n.t('session.expired.title'),
      displayableDescription: i18n.t('session.expired.message'),
    })
  );

export const PartyRegistryProxyApi = {
  getTaxonomiesByQuery: async (query: string): Promise<Array<GeographicTaxonomyResource>> => {
    console.log('xx query', query);
    const result = await apiClient.retrieveGeoTaxonomiesByDescriptionUsingGET({
      description: query,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
