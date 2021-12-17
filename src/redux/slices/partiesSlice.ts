import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';

interface PartiesState {
  list?: Array<Party>;
  selected?: Party;
  selectedPartyLogoUrl?: string;
  selectedProducts?: Array<Product>;
}

const initialState: PartiesState = {};

/* eslint-disable functional/immutable-data */
export const partiesSlice = createSlice({
  name: 'parties',
  initialState,
  reducers: {
    setPartiesList: (state, action: PayloadAction<Array<Party>>) => {
      state.list = action.payload;
    },
    setPartySelected: (state, action: PayloadAction<Party>) => {
      state.selected = action.payload;
      state.selectedPartyLogoUrl = action.payload.urlLogo;
    },
    setPartySelectedPartyLogo: (state, action: PayloadAction<string | undefined>) => {
      state.selectedPartyLogoUrl = `${action.payload}?${new Date()}`;
      if (state.list) {
        state.list
          .filter((p) => p.institutionId === state.selected?.institutionId)
          .forEach((p) => (p.urlLogo = state.selectedPartyLogoUrl));
      }
    },
    setPartySelectedProducts: (state, action: PayloadAction<Array<Product>>) => {
      state.selectedProducts = action.payload;
    },
  },
});

export const partiesActions = partiesSlice.actions;
export const partiesReducer = partiesSlice.reducer;

export const partiesSelectors = {
  selectPartiesList: (state: RootState): Array<Party> | undefined => state.parties.list,
  selectPartySelected: (state: RootState): Party | undefined => state.parties.selected,
  selectPartySelectedLogo: (state: RootState): string | undefined =>
    state.parties.selectedPartyLogoUrl,
  selectPartySelectedProducts: (state: RootState): Array<Product> | undefined =>
    state.parties.selectedProducts,
};
