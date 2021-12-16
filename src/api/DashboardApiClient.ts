import { storageRead } from '../utils/storage-utils';
import { STORAGE_KEY_TOKEN } from '../utils/constants';
import { store } from '../redux/store';
import { appStateActions } from '../redux/slices/appStateSlice';
import { createClient, WithDefaultsT } from './generated/b4f-dashboard/client';
import { buildFetchApi, extractResponse } from './api-utils';
import { InstitutionResource } from './generated/b4f-dashboard/InstitutionResource';
import { ProductsResource } from './generated/b4f-dashboard/ProductsResource';

const dashboardBaseUrl = process.env.REACT_APP_URL_API_DASHBOARD;
const dashboardTimeoutMs = process.env.REACT_APP_API_DASHBOARD_TIMEOUT_MS;

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageRead(STORAGE_KEY_TOKEN, 'string');
    return wrappedOperation({
      ...params,
      bearerAuth: `Bearer ${token}`,
    });
  };

const apiClient = createClient({
  baseUrl: dashboardBaseUrl,
  basePath: '',
  fetchApi: buildFetchApi(dashboardTimeoutMs),
  withDefaults: withBearerAndInstitutionId,
});

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: 'Sessione scaduta',
      displayableDescription: 'Stai per essere rediretto alla pagina di login...',
    })
  );

export const DashboardApi = {
  getInstitutions: async (): Promise<Array<InstitutionResource>> => {
    const result = await apiClient.getInstitutionsUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitution: async (institutionId: string): Promise<InstitutionResource> => {
    const result = await apiClient.getInstitutionUsingGET({
      institutionId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getProducts: async (institutionId: string): Promise<Array<ProductsResource>> => {
    const result = await apiClient.getInstitutionProductsUsingGET({ institutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  uploadLogo: async (institutionId: string, logo: File): Promise<boolean> => {
    const result = await apiClient.saveInstitutionLogoUsingPUT({
      institutionId,
      logo,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getTokenExchange: async (
    hostname: string,
    institutionId: string,
    productId: string
  ): Promise<string> => {
    const result = await apiClient.exchangeUsingGET({
      productId,
      institutionId,
      realm: hostname,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPartyUsers: async (institutionId: string): Promise<> => {
    const result = await apiClient.getInstitutionUsersUsingGET({ institutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
