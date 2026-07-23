import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminRolesState {
  // map productId -> role (last seen)
  rolesByProduct: Record<string, string>;
  // unique roles across products
  uniqueRoles: Array<string>;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  needsReload: boolean;
}

const initialState: AdminRolesState = {
  rolesByProduct: {},
  uniqueRoles: [],
  status: 'idle',
  needsReload: false,
};

const adminRolesSlice = createSlice({
  name: 'adminRoles',
  initialState,
  reducers: {
    setAdminProductRoles: (
      state,
      action: PayloadAction<Array<{ productId: string; role?: string }>>
    ) => {
      const map = (action.payload || []).reduce((acc, p) => {
        if (p.productId) {
          return { ...acc, [p.productId]: p.role ?? '' } as Record<string, string>;
        }
        return acc;
      }, {} as Record<string, string>);

      const uniques = Array.from(
        new Set(Object.values(map).filter((r) => r && r.length > 0))
      );

      return {
        ...state,
        rolesByProduct: map,
        uniqueRoles: uniques,
        status: 'succeeded',
        needsReload: false,
      } as AdminRolesState;
    },
    resetAdminProductRoles: () => ({ ...initialState }),
    setAdminRolesStatus: (state, action: PayloadAction<'idle' | 'pending' | 'succeeded' | 'failed'>) => ({
      ...state,
      status: action.payload,
    }),
    markAdminPermissionsStale: (state) => ({
      ...state,
      needsReload: true,
    }),
  },
});

export const {
  setAdminProductRoles,
  resetAdminProductRoles,
  setAdminRolesStatus,
  markAdminPermissionsStale,
} = adminRolesSlice.actions;
export const adminRolesReducer = adminRolesSlice.reducer;

// selectors
export const selectAdminRolesByProduct = (state: any) => state.adminRoles.rolesByProduct;
export const selectAdminUniqueRoles = (state: any) => state.adminRoles.uniqueRoles;
export const selectAdminRolesStatus = (state: any) => state.adminRoles.status;
export const selectAdminRolesNeedsReload = (state: any) => state.adminRoles.needsReload;

export default adminRolesSlice;
