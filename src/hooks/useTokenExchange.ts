import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { LOADING_TASK_TOKEN_EXCHANGE } from '../utils/constants';
import { Product } from '../model/Product';
import { retrieveTokenExchange } from '../services/tokenExchangeService';
import { Party } from '../model/Party';

const tokenPlaceholder = '<IdentityToken>';
const hostnameRegexp = /^(?:https?:\/\/)([-.a-zA-Z0-9_]+)/;

export const useTokenExchange = () => {
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_TOKEN_EXCHANGE);

  const invokeProductBo = async (
    product: Product,
    selectedParty: Party,
    selectedEnvironment?: string
  ): Promise<void> => {
    const selectedEnvironmentUrl = product.urlTest?.find(
      (p) => p.environment === selectedEnvironment
    )?.url;
    const result = selectedEnvironmentUrl
      ? validateUrlBO(selectedEnvironmentUrl)
      : validateUrlBO(product?.urlBO);
    if (result instanceof Error) {
      addError({
        id: `ValidationUrlError-${product?.id}`,
        blocking: false,
        error: result,
        techDescription: result.message,
        toNotify: true,
      });
      return;
    }

    setLoading(true);
    retrieveTokenExchange(selectedParty, product, selectedEnvironment)
      .then((t) =>
        trackEvent(
          'DASHBOARD_OPEN_PRODUCT',
          {
            party_id: selectedParty.partyId,
            product_id: product.id,
            product_role: product.userRole,
          },
          () => window.location.assign(product.urlBO.replace(tokenPlaceholder, t))
        )
      )
      .catch((error) =>
        addError({
          id: `TokenExchangeError-${product.id}`,
          blocking: false,
          error,
          techDescription: `Something gone wrong retrieving token exchange for product ${product.id}`,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  };

  return { invokeProductBo };
};

export const validateUrlBO = (url: string): string | Error => {
  if (url?.indexOf(tokenPlaceholder) === -1) {
    return new Error(`URL doesn't contain token placeholder ${tokenPlaceholder}: ${url}`);
  }

  const hostname = hostnameFromUrl(url);
  if (!hostname) {
    return new Error(`Cannot extract hostname from URL: ${url}`);
  }

  return hostname;
};

const hostnameFromUrl = (url: string): string | null => {
  const regexpResults = hostnameRegexp.exec(url);
  if (regexpResults && regexpResults.length > 1) {
    return regexpResults[1];
  } else {
    return null;
  }
};
