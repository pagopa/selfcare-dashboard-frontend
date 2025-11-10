import useLoading from '@pagopa/selfcare-common-frontend/lib/hooks/useLoading';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { Party } from '../model/Party';
import { Product } from '../model/Product';
import { ProductsRolesMap } from '../model/ProductRole';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchPartyDetails } from '../services/partyService';
import { fetchProducts } from '../services/productService';
import { LOADING_TASK_SEARCH_PARTY, LOADING_TASK_SEARCH_PRODUCTS } from '../utils/constants';

export const useSelectedParty = (): {
  fetchSelectedParty: (partyId: string) => Promise<[Party | null, Array<Product> | null]>;
} => {
  const parties = useAppSelector(partiesSelectors.selectPartiesList);
  const dispatch = useAppDispatch();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const selectedPartyProducts = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const setParty = (party?: Party) => dispatch(partiesActions.setPartySelected(party));
  const setPartyProducts = (products?: Array<Product>) =>
    dispatch(partiesActions.setPartySelectedProducts(products));
  const setLoadingDetails = useLoading(LOADING_TASK_SEARCH_PARTY);
  const setLoadingProducts = useLoading(LOADING_TASK_SEARCH_PRODUCTS);
  const productsRolesMap = useAppSelector(partiesSelectors.selectPartySelectedProductsRolesMap);

  const fetchParty = (partyId: string): Promise<Party | null> =>
    fetchPartyDetails(partyId).then((party) => {
      if (party) {
        const selectedParty = isPagoPaUser ? party : parties?.find((p) => p.partyId === partyId);
        if (selectedParty && selectedParty.status !== 'ACTIVE') {
          throw new Error(`INVALID_PARTY_STATE_${selectedParty.status}`);
        }
        const partyWithUserRoleAndStatus = {
          ...party,
          status: selectedParty?.status,
          userRole: selectedParty?.userRole,
        };
        setParty(partyWithUserRoleAndStatus);

        const productPermissions = [...party.products]
          .filter((product) => product.productOnBoardingStatus === 'ACTIVE')
          .map((product) => ({
            productId: product.productId ?? '',
            actions: product.userProductActions ? [...product.userProductActions] : [],
          }));

        dispatch(setProductPermissions(productPermissions));

        const institutionTypesList = [...party.products]
          .filter((product) => product.productOnBoardingStatus === 'ACTIVE')
          .map((product) => product.institutionType);

        dispatch(partiesActions.setPartySelectedInstitutionTypes(institutionTypesList));
        return party;
      } else {
        throw new Error(`Cannot find partyId ${partyId}`);
      }
    });
  const fetchProductLists = () =>
    fetchProducts().then((products) => {
      if (products) {
        setPartyProducts(products);
        dispatch(
          partiesActions.setPartySelectedProductsRolesMap(
            products
              .filter((p) =>
                selectedParty?.products.map(
                  (us) => us.productId === p.id && us.productOnBoardingStatus === 'ACTIVE'
                )
              )
              .reduce((acc, p) => {
                const rolesMap = productsRolesMap[p.id];
                if (rolesMap) {
                  // eslint-disable-next-line functional/immutable-data
                  acc[p.id] = rolesMap;
                }
                return acc;
              }, {} as ProductsRolesMap)
          )
        );
        return products;
      } else {
        throw new Error(`Cannot find products of partyId ${selectedParty?.partyId}`);
      }
    });

  const fetchSelectedParty = (partyId: string) => {
    if (!selectedParty || selectedParty.partyId !== partyId) {
      setLoadingDetails(true);
      setLoadingProducts(true);

      const partyDetailPromise: Promise<Party | null> = fetchParty(partyId).finally(() =>
        setLoadingDetails(false)
      );

      const partyProductsPromise: Promise<Array<Product> | null> = fetchProductLists().finally(() =>
        setLoadingProducts(false)
      );

      return Promise.all([partyDetailPromise, partyProductsPromise]).catch((e) => {
        setParty(undefined);
        setPartyProducts(undefined);
        throw e;
      });
    } else {
      return Promise.all([
        new Promise<Party>((resolve) => resolve(selectedParty)),
        new Promise<Array<Product>>((resolve) => resolve(selectedPartyProducts ?? [])),
      ]);
    }
  };

  return { fetchSelectedParty };
};
