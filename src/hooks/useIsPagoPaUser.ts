import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';

/**
 * Whether the logged user is a PagoPA backstage operator (Google login, iss: 'PAGOPA').
 * Single entry point for components and hooks; non-React code (services, utils) keeps using
 * `isPagoPaUser` directly.
 */
export const useIsPagoPaUser = (): boolean => isPagoPaUser();
