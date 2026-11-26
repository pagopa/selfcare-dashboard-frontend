import { usePermissions } from '@pagopa/selfcare-common-frontend/lib/hooks/usePermissions';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { Actions, PRODUCT_IDS } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useMemo, useState } from 'react';
import { TypeEnum as DocumentType } from '../../../api/generated/b4f-dashboard/DocumentResource';
import { ProductOnBoardingStatusEnum } from '../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { useAppDispatch } from '../../../redux/hooks';
import { fetchProductsContractUpdateStatus } from '../../../services/contractUpdateService';
import { getDocumentsList } from '../../../services/documentService';
import { ENV } from '../../../utils/env';
import {
  getDocumentProductIds,
  getEligibleDocumentProducts,
} from '../../documents/list/productUtils';

const permissionsMatchParty = (
  party: Party | null | undefined,
  permissions: ReturnType<typeof usePermissions>['productPermissions']
) =>
  JSON.stringify(
    party?.products
      .filter((product) => product.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE)
      .map((product) => ({
        productId: product.productId ?? '',
        actions: product.userProductActions ?? [],
      }))
  ) === JSON.stringify(permissions.map(({ productId, actions }) => ({ productId, actions })));

const reportVisibilityError = (
  dispatch: ReturnType<typeof useAppDispatch>,
  partyId: string,
  error: unknown
) =>
  dispatch(
    appStateActions.addError({
      id: `documentsVisibility-${partyId}`,
      blocking: false,
      error: error instanceof Error ? error : new Error(String(error)),
      techDescription: `Something went wrong checking document visibility for party ${partyId}`,
      toNotify: true,
    })
  );

const checkDocumentsVisibility = async (
  partyId: string,
  productIds: Array<string>,
  documentIds: Array<string>
) => {
  const [statusResult, ...documentResults] = await Promise.allSettled([
    fetchProductsContractUpdateStatus(partyId, productIds),
    ...documentIds.map((productId) => getDocumentsList(partyId, productId)),
  ]);
  const visible =
    (statusResult.status === 'fulfilled' &&
      statusResult.value.some(
        (status) =>
          productIds.includes(status.productId) &&
          (status.contractUpdateRequired || status.contractUpdateInProgress)
      )) ||
    documentResults.some(
      (result) =>
        result.status === 'fulfilled' &&
        result.value.some((document) => document.type === DocumentType.INSTITUTION)
    );
  const failure = [statusResult, ...documentResults].find(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  );
  return { visible, failure };
};

const useVisibilityResult = (
  partyId: string | undefined,
  productIds: Array<string>,
  documentIds: Array<string>
): boolean | undefined => {
  const dispatch = useAppDispatch();
  const scope = useMemo(() => ({}), [partyId, productIds, documentIds]);
  const [result, setResult] = useState<{ scope: object; visible: boolean }>();

  useEffect(() => {
    if (!partyId || productIds.length === 0) {
      return;
    }

    // eslint-disable-next-line functional/no-let
    let active = true;
    void checkDocumentsVisibility(partyId, productIds, documentIds)
      .then(({ visible, failure }) => {
        if (!active) {
          return;
        }

        if (!visible && failure) {
          reportVisibilityError(dispatch, partyId, failure.reason);
        }
        setResult({ scope, visible });
      })
      .catch((error) => {
        if (active) {
          reportVisibilityError(dispatch, partyId, error);
          setResult({ scope, visible: false });
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch, documentIds, partyId, productIds, scope]);

  if (productIds.length === 0) {
    return false;
  }
  return result?.scope === scope ? result.visible : undefined;
};

const useDocumentsVisibility = (
  party: Party | null | undefined,
  products: Array<Product> | null | undefined,
  enabled: boolean
): boolean | undefined => {
  const { productPermissions } = usePermissions();
  const documentProducts = useMemo(() => {
    if (!party || !products || !enabled) {
      return [];
    }
    return getEligibleDocumentProducts(party, products, productPermissions);
  }, [party, products, enabled, productPermissions]);
  const productIds = useMemo(() => getDocumentProductIds(documentProducts), [documentProducts]);
  const documentIds = useMemo(
    () => Array.from(new Set(documentProducts.map(({ productId }) => productId))),
    [documentProducts]
  );
  return useVisibilityResult(party?.partyId, productIds, documentIds);
};

export const useDocumentsSectionVisibility = (
  party: Party | null | undefined,
  products: Array<Product> | null | undefined,
  isPagoPa: boolean
): boolean | undefined => {
  const { hasPermission, getAllProductsWithPermission, productPermissions } = usePermissions();
  const permissionsReady = permissionsMatchParty(party, productPermissions);
  const legacyVisible =
    !!party?.products.some(
      (product) =>
        product.productId === PRODUCT_IDS.PAGOPA &&
        product.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE &&
        product.institutionType === 'PSP'
    ) && hasPermission(PRODUCT_IDS.PAGOPA, Actions.ViewContract);
  const newVisibility = useDocumentsVisibility(
    party,
    products,
    ENV.SHOW_DOCUMENTS && !isPagoPa && permissionsReady && !legacyVisible
  );
  if (!ENV.SHOW_DOCUMENTS) {
    return false;
  }
  if (isPagoPa) {
    return getAllProductsWithPermission(Actions.ViewContract).length > 0;
  }
  if (!permissionsReady) {
    return undefined;
  }
  return legacyVisible || newVisibility;
};
