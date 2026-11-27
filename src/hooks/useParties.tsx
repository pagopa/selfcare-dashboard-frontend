import useReduxCachedValue from '@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue';
import { BaseParty } from '../model/Party';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchParties } from '../services/partyService';

export const useParties = (): (() => Promise<Array<BaseParty>>) =>
  useReduxCachedValue(
    'PARTIES',
    fetchParties,
    partiesSelectors.selectPartiesList,
    partiesActions.setPartiesList
  );
