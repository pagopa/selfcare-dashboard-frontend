import { storageRead } from '@pagopa/selfcare-common-frontend/utils/storage-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { STORAGE_KEY_TOKEN } from '../utils/constants';
import { store } from '../redux/store';
import { PartyUserOnCreation } from '../model/PartyUser';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/b4f-dashboard/client';
import { buildFetchApi, extractResponse } from './api-utils';
import { InstitutionResource } from './generated/b4f-dashboard/InstitutionResource';
import { ProductsResource } from './generated/b4f-dashboard/ProductsResource';
import { InstitutionUserResource } from './generated/b4f-dashboard/InstitutionUserResource';
import { ProductUserResource } from './generated/b4f-dashboard/ProductUserResource';
import { IdentityTokenResource } from './generated/b4f-dashboard/IdentityTokenResource';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageRead(STORAGE_KEY_TOKEN, 'string');
    return wrappedOperation({
      ...params,
      bearerAuth: `Bearer ${token}`,
    });
  };

const apiClient = createClient({
  baseUrl: ENV.URL_API.API_DASHBOARD,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.DASHBOARD),
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
  ): Promise<IdentityTokenResource> => {
    const result = await apiClient.exchangeUsingGET({
      productId,
      institutionId,
      realm: hostname,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPartyUsers: async (
    institutionId: string,
    productId?: string,
    role?: string
  ): Promise<Array<InstitutionUserResource>> => {
    const result = await apiClient.getInstitutionUsersUsingGET({ institutionId, role, productId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPartyProductUsers: async (
    institutionId: string,
    productId: string,
    role?: string
  ): Promise<Array<ProductUserResource>> => {
    const result = await apiClient.getInstitutionProductUsersUsingGET({
      institutionId,
      productId,
      role,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  savePartyUser: async (
    institutionId: string,
    productId: string,
    user: PartyUserOnCreation
  ): Promise<void> => {
    const result = await apiClient.createInstitutionProductUserUsingPOST({
      institutionId,
      productId,
      body: user,
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  suspendPartyRelation: async (relationshipId: string): Promise<void> => {
    const result = await apiClient.suspendRelationshipUsingPOST({
      relationshipId,
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  activatePartyRelation: async (relationshipId: string): Promise<void> => {
    const result = await apiClient.activateRelationshipUsingPOST({
      relationshipId,
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  getProductRoles: async (productId: string): Promise<Array<string>> => {
    const result = await apiClient.getProductRolesUsingGET({
      productId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
