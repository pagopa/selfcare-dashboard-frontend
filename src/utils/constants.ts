const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const LOADING_TASK_SEARCH_PARTIES = 'SEARCH_PARTIES';
export const LOADING_TASK_SEARCH_PARTY = 'SEARCH_PARTY';
export const LOADING_TASK_SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
export const LOADING_TASK_TOKEN_EXCHANGE = 'TOKEN_EXCHANGE';
export const LOADING_TASK_TOKEN_EXCHANGE_INVOICE = 'TOKEN_EXCHANGE_INVOICE';
export const LOADING_TASK_FETCH_PRODUCT_ROLES = 'FETCH_PRODUCT_ROLES';
export const LOADING_TASK_SAVE_PARTY_GEOTAXONOMIES = 'SAVE_PARTY_GEOTAXONOMIES';
export const LOADING_TASK_DELEGATION_FORM = 'DELEGATION_FORM';

export enum INTEROP_PRODUCT_ENUM {
  INTEROP = 'prod-interop',
  INTEROP_ATST = 'prod-interop-atst',
  INTEROP_COLL = 'prod-interop-coll',
}

export const interopProductIdList = [
  INTEROP_PRODUCT_ENUM.INTEROP,
  INTEROP_PRODUCT_ENUM.INTEROP_ATST,
  INTEROP_PRODUCT_ENUM.INTEROP_COLL,
];

export const PRODUCT_IDS = {
  PAGOPA: 'prod-pagopa',
  PAGOPA_INSIGHTS: 'prod-pagopa-insights',
  IO: 'prod-io',
} as const;
