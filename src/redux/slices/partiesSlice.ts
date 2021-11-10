import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Party } from '../../model/Party';

interface PartiesState {
  list?: Array<Party>;
  selected?: Party;
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
    },
  },
});

export const partiesActions = partiesSlice.actions;
export const partiesReducer = partiesSlice.reducer;

export const partiesSelectors = {
  selectPartiesList: (state: RootState) => state.parties.list,
  selectPartySelected: (state: RootState) => state.parties.selected,
};
