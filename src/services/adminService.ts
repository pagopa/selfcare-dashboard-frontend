import { Actions } from "@pagopa/selfcare-common-frontend/lib/utils/constants";
import { DashboardApi } from "../api/DashboardApiClient";
import { ProductRolePermissionsList } from "../api/generated/b4f-dashboard/ProductRolePermissionsList";

export const COMMON_ADMIN_ACTIONS = [
    Actions.AccessProductBackoffice,
    Actions.AccessProductBackofficeAdmin,
    Actions.CreateProductUsers,
    Actions.UpdateProductUsers,
    Actions.DeleteProductUsers,
    Actions.ListProductUsers,
    Actions.ListProductGroups,
    Actions.ListAllProductUsers,
    Actions.ListAllProductGroups,
    Actions.ManageProductGroups,
    Actions.ViewDelegations,
    Actions.ViewBilling,
    Actions.ListActiveProducts,
    Actions.ListAvailableProducts,
    Actions.CreateDelegation,
    Actions.ViewContract,
    Actions.UpdateGeoTaxonomy,
];

export const getPermissionsAdminService = (): Promise<ProductRolePermissionsList> => {
    if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
        return Promise.resolve({
            items: [
                {
                    productId: 'ALL',
                    role: 'mocked-role',
                    permissions: COMMON_ADMIN_ACTIONS,
                },
                {
                    productId: 'prod-pn',
                    role: 'mocked-role',
                    permissions: COMMON_ADMIN_ACTIONS,
                },
                {
                    productId: 'prod-io',
                    role: 'mocked-role',
                    permissions: COMMON_ADMIN_ACTIONS,
                },
            ],
        } as ProductRolePermissionsList);
    } else {
        return DashboardApi.myPermissionsAdmin();
    }
};