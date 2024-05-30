import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { Party } from '../model/Party';
import { Product } from '../model/Product';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { BrokerResource } from './generated/b4f-dashboard/BrokerResource';
import { DelegationIdResource } from './generated/b4f-dashboard/DelegationIdResource';
import { TypeEnum } from './generated/b4f-dashboard/DelegationRequestDto';
import { DelegationWithPagination } from './generated/b4f-dashboard/DelegationWithPagination';
import { GeographicTaxonomyDto } from './generated/b4f-dashboard/GeographicTaxonomyDto';
import { InstitutionBaseResource } from './generated/b4f-dashboard/InstitutionBaseResource';
import {
  InstitutionResource,
  InstitutionTypeEnum,
} from './generated/b4f-dashboard/InstitutionResource';
import { ProductRoleMappingsResource } from './generated/b4f-dashboard/ProductRoleMappingsResource';
import { ProductsResource } from './generated/b4f-dashboard/ProductsResource';
import { WithDefaultsT, createClient } from './generated/b4f-dashboard/client';

const withBearerAndPartyId: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    bearerAuth: `Bearer ${token}`,
  });
};

const apiClient = createClient({
  baseUrl: ENV.URL_API.API_DASHBOARD,
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

export const DashboardApi = {
  getInstitutions: async (): Promise<Array<InstitutionBaseResource>> => {
    const result = await apiClient.v2RetrieveUserInstitutions({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitution: async (institutionId: string): Promise<InstitutionResource> => {
    const result = await apiClient.v2GetInstitution({
      institutionId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getProducts: async (): Promise<Array<ProductsResource>> => {
    const result = await apiClient.getProductsTreeUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getDelegations: async (institutionId: string): Promise<Array<ProductsResource>> => {
    const result = await apiClient.getDelegationsUsingFromUsingGET({ institutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  uploadLogo: async (institutionId: string, logo: File): Promise<boolean> => {
    const result = await apiClient.saveInstitutionLogoUsingPUT({
      institutionId,
      logo,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getBackOfficeUrl: async (
    institutionId: string,
    productId: string,
    environment?: string
  ): Promise<string> => {
    const result = await apiClient.v2RetrieveProductBackofficeUsingGET({
      productId,
      institutionId,
      environment,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getBillingToken: async (institutionId: string, environment?: string): Promise<string> => {
    const result = await apiClient.billingTokenUsingGET({
      institutionId,
      environment,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getDelegatingInstitutions: async (institutionId: string): Promise<DelegationWithPagination> => {
    const result = await apiClient.getDelegationsUsingToUsingGET_1({ institutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getProductRoles: async (productId: string): Promise<Array<ProductRoleMappingsResource>> => {
    const result = await apiClient.getProductRolesUsingGET({
      productId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateInstitutionGeographicTaxonomy: async (
    institutionId: string,
    geographicTaxonomies: ReadonlyArray<GeographicTaxonomyDto>
  ): Promise<boolean> => {
    const result = await apiClient.updateInstitutionGeographicTaxonomyUsingPUT({
      institutionId,
      body: {
        geographicTaxonomyDtoList: geographicTaxonomies,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getProductBrokers: async (
    productId: string,
    institutionType: InstitutionTypeEnum
  ): Promise<Array<BrokerResource>> => {
    const result = await apiClient.getProductBrokersUsingGET({
      productId,
      institutionType,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createDelegation: async (
    party: Party,
    product: Product,
    techPartner: BrokerResource
  ): Promise<DelegationIdResource> => {
    const result = await apiClient.createDelegationUsingPOST({
      body: {
        from: party.partyId,
        institutionFromName: party.description,
        institutionToName: techPartner.description ?? '',
        to: techPartner.code ?? '',
        productId: product.id,
        type: 'PT' as TypeEnum,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },
};
