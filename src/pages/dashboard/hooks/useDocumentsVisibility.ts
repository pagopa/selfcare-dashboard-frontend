import { usePermissions } from '@pagopa/selfcare-common-frontend/lib/hooks/usePermissions';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
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

// Wait until the shared permissions reflect the selected party's active products.
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

// Report failures that prevent determining document visibility.
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

// Check update statuses and document lists without letting one failed request hide other results.
const checkDocumentsVisibility = async (
  partyId: string,
  productIds: Array<string>,
  documentIds: Array<string>
) => {
  // Statuses use parent product IDs; document lists use the individual product IDs.
  const [statusResult, ...documentResults] = await Promise.allSettled([
    fetchProductsContractUpdateStatus(partyId, productIds),
    ...documentIds.map((productId) => getDocumentsList(partyId, productId)),
  ]);
  // A required or pending update, or an institution document, makes the section visible.
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
  // Keep the first failure to report if no successful response establishes visibility.
  const failure = [statusResult, ...documentResults].find(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  );
  return { visible, failure };
};

// Fetch visibility for the current party and discard results from previous inputs.
const useVisibilityResult = (
  partyId: string | undefined,
  productIds: Array<string>,
  documentIds: Array<string>
): boolean | undefined => {
  // Dispatch a notification when visibility cannot be established.
  const dispatch = useAppDispatch();
  // Identify this set of inputs so an old response cannot be reused.
  const scope = useMemo(() => ({}), [partyId, productIds, documentIds]);
  // Keep the result associated with the inputs that produced it.
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

// Find eligible products and resolve their document visibility.
const useDocumentsVisibility = (
  party: Party | null | undefined,
  products: Array<Product> | null | undefined,
  enabled: boolean
): boolean | undefined => {
  // Use the current product permissions to filter document requests.
  const { productPermissions } = usePermissions();
  // Include only active, contract-enabled products the user can view.
  const documentProducts = useMemo(() => {
    if (!party || !products || !enabled) {
      return [];
    }
    return getEligibleDocumentProducts(party, products, productPermissions);
  }, [party, products, enabled, productPermissions]);
  // Update statuses are requested using parent product IDs.
  const productIds = useMemo(() => getDocumentProductIds(documentProducts), [documentProducts]);
  // Document lists are requested for each eligible product or subproduct.
  const documentIds = useMemo(
    () => Array.from(new Set(documentProducts.map(({ productId }) => productId))),
    [documentProducts]
  );
  return useVisibilityResult(party?.partyId, productIds, documentIds);
};

// Combine the feature flag, PagoPA permissions and document visibility checks.
export const useDocumentsSectionVisibility = (
  party: Party | null | undefined,
  products: Array<Product> | null | undefined,
  isPagoPa: boolean
): boolean | undefined => {
  // Read the permissions used by both SelfCare and PagoPA visibility rules.
  const { getAllProductsWithPermission, productPermissions } = usePermissions();
  
  // Avoid deciding visibility using permissions from a previously selected party.
  const permissionsReady = permissionsMatchParty(party, productPermissions);

  // Check document eligibility for SelfCare users once their permissions are current.
  const newVisibility = useDocumentsVisibility(
    party,
    products,
    ENV.SHOW_DOCUMENTS && !isPagoPa && permissionsReady
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
  return newVisibility;
};
