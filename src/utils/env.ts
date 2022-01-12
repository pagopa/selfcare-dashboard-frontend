import * as env from 'env-var';

const PUBLIC_URL_INNER: string | undefined = env.get('PUBLIC_URL').asString();
export const PUBLIC_URL: string = PUBLIC_URL_INNER ? PUBLIC_URL_INNER : '/dashboard';

export const ENABLE_ASSISTANCE: boolean = env
  .get('REACT_APP_ENABLE_ASSISTANCE')
  .required()
  .asBool();

export const PAGOPA_HELP_EMAIL: string = env
  .get('REACT_APP_PAGOPA_HELP_EMAIL')
  .required()
  .asString();

export const URL_FE_LOGIN: string =
  env.get('REACT_APP_URL_FE_LOGIN').required().asString() + '?onSuccess=dashboard';
export const URL_FE_LOGOUT: string = env.get('REACT_APP_URL_FE_LOGOUT').required().asString();
export const URL_FE_ONBOARDING: string = env
  .get('REACT_APP_URL_FE_ONBOARDING')
  .required()
  .asString();
export const URL_FE_LANDING: string = env.get('REACT_APP_URL_FE_LANDING').required().asString();

export const URL_API_DASHBOARD: string = env
  .get('REACT_APP_URL_API_DASHBOARD')
  .required()
  .asString();
export const API_DASHBOARD_TIMEOUT_MS: number = env
  .get('REACT_APP_API_DASHBOARD_TIMEOUT_MS')
  .required()
  .asInt();

export const URL_INSTITUTION_LOGO_PREFIX: string = env
  .get('REACT_APP_URL_INSTITUTION_LOGO_PREFIX')
  .required()
  .asString();
export const URL_INSTITUTION_LOGO_SUFFIX: string = env
  .get('REACT_APP_URL_INSTITUTION_LOGO_SUFFIX')
  .required()
  .asString();

export const PARTY_USERS_PAGE_SIZE: number = env
  .get('REACT_APP_PARTY_USERS_PAGE_SIZE')
  .required()
  .asInt();
