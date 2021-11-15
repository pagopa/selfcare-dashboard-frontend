import useLoading from '../hooks/useLoading';
import { Party } from '../model/Party';
import { Product } from '../model/Product';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchPartyDetails } from '../services/partyService';
import { fetchProducts } from '../services/productService';
import { LOADING_TASK_SEARCH_PARTY, LOADING_TASK_SEARCH_PRODUCTS } from '../utils/constants';

export const useSelectedParty = (): {
  fetchSelectedParty: (institutionId: string) => Promise<[Party | null, Array<Product> | null]>;
} => {
  const dispatch = useAppDispatch();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const selectedPartyProducts = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const parties = useAppSelector(partiesSelectors.selectPartiesList);
  const setParty = (party: Party) => dispatch(partiesActions.setPartySelected(party));
  const setPartyProducts = (products: Array<Product>) =>
    dispatch(partiesActions.setPartySelectedProducts(products));
  const setLoadingDetails = useLoading(LOADING_TASK_SEARCH_PARTY);
  const setLoadingProducts = useLoading(LOADING_TASK_SEARCH_PRODUCTS);

  const fetchSelectedParty = (institutionId: string) => {
    if (!selectedParty || selectedParty.institutionId !== institutionId) {
      setLoadingDetails(true);
      setLoadingProducts(true);

      const partyDetailPromise: Promise<Party | null> = fetchPartyDetails(institutionId, parties)
        .then((party) => {
          if (party) {
            setParty(party);
            return party;
          } else {
            throw new Error(`Cannot find institutionId ${institutionId}`);
          }
        })
        .finally(() => setLoadingDetails(false));

      const partyProductsPromise: Promise<Array<Product> | null> = fetchProducts(institutionId)
        .then((products) => {
          if (products) {
            setPartyProducts(products);
            return products;
          } else {
            throw new Error(`Cannot find products of institutionId ${institutionId}`);
          }
        })
        .finally(() => setLoadingProducts(false));

      return Promise.all([partyDetailPromise, partyProductsPromise]);
    } else {
      return Promise.all([
        new Promise<Party>((resolve) => resolve(selectedParty)),
        new Promise<Array<Product>>((resolve) => resolve(selectedPartyProducts ?? [])),
      ]);
    }
  };

  return { fetchSelectedParty };
};
