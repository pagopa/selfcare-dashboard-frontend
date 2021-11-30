import { LOADING_TASK_TOKEN_EXCHANGE } from '../utils/constants';
import { useAppDispatch } from '../redux/hooks';
import { Product } from '../model/Product';
import { retrieveTokenExchange } from '../services/tokenExchangeService';
import { Party } from '../model/Party';
import { appStateActions } from '../redux/slices/appStateSlice';
import useLoading from './useLoading';

const tokenPlaceholder = '[identityToken]';
const hostnameRegexp = /(?<=^https?:\/\/)[-.a-zA-Z0-9_]+/;

export const useTokenExchange = () => {
  const dispatch = useAppDispatch();
  const setLoading = useLoading(LOADING_TASK_TOKEN_EXCHANGE);

  const invokeProductBo = async (product: Product, selectedParty: Party): Promise<void> => {
    const result = validateUrlBO(product.urlBO);
    if (result instanceof Error) {
      dispatch(
        appStateActions.addError({
          id: `ValidationUrlError-${product.id}`,
          blocking: false,
          error: result,
          techDescription: result.message,
        })
      );
      return;
    }

    setLoading(true);
    retrieveTokenExchange(result, selectedParty)
      .then((t) => window.location.assign(product.urlBO.replace(tokenPlaceholder, t)))
      .finally(() => setLoading(false));
  };

  return { invokeProductBo };
};

export const validateUrlBO = (url: string): string | Error => {
  if (url.indexOf(tokenPlaceholder) === -1) {
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
  if (regexpResults && regexpResults.length > 0) {
    return regexpResults[0];
  } else {
    return null;
  }
};
