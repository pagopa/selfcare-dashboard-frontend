import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminRolesState {
  // map productId -> role (last seen)
  rolesByProduct: Record<string, string>;
  // unique roles across products
  uniqueRoles: Array<string>;
}

const initialState: AdminRolesState = {
  rolesByProduct: {},
  uniqueRoles: [],
};

const adminRolesSlice = createSlice({
  name: 'adminRoles',
  initialState,
  reducers: {
    setAdminProductRoles: (
      state,
      action: PayloadAction<Array<{ productId: string; role?: string }>>
    ) => {
      // build a new map instead of mutating state to satisfy lint rules
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
      } as AdminRolesState;
    },
    resetAdminProductRoles: () => ({ ...initialState }),
  },
});

export const { setAdminProductRoles, resetAdminProductRoles } = adminRolesSlice.actions;
export const adminRolesReducer = adminRolesSlice.reducer;

// selectors
export const selectAdminRolesByProduct = (state: any) => state.adminRoles.rolesByProduct;
export const selectAdminUniqueRoles = (state: any) => state.adminRoles.uniqueRoles;

export default adminRolesSlice;
