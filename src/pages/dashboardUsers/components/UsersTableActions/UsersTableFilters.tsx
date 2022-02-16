import { Grid, Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';
import FilterModal, {
  FilterModalConfig,
} from '@pagopa/selfcare-common-frontend/components/FilterModal';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { UserRole } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { ProductRole, ProductsRolesMap } from '../../../../model/ProductRole';

export type UsersTableFiltersConfig = {
  /** If the roles configuration imply a set of products, this will be considered as filter */
  productIds: Array<string>;
  /** The selc roles selected as filter */
  selcRole: Array<UserRole>;
  /** The product roles selected as filter */
  productRoles: Array<ProductRole>;
};

const chipSelectedStyle = { backgroundColor: '#8B98A6', color: '#FFFFFF', width: '100%' };
const chipStyle = {
  backgroundColor: '#FCFDFF',
  color: '#5C6F82',
  width: '13ch',
  border: '1px solid #E6E9F2',
};

interface UsersSearchFilterProps {
  products: Array<Product>;
  selectedProduct?: Product;
  disableFilters: boolean;
  filters: UsersTableFiltersConfig;
  onFiltersChange: (f: UsersTableFiltersConfig) => void;
  productsRolesMap: ProductsRolesMap; // TODO use me to build filter component
}

export default function UsersTableFilters({
  filters,
  onFiltersChange,
  disableFilters,
}: UsersSearchFilterProps) {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [filterModalConfig, setFilterModalConfig] = useState<FilterModalConfig<any, any>>();
  const [titleModal, setTitleModal] = useState('');

  const handleDeleteFilterRole = () => {
    onFiltersChange({ ...filters, selcRole: [] });
  };

  const onClickFilterRole = () => {
    setOpenLogoutModal(true);
    setTitleModal('Ruolo');
    setFilterModalConfig({
      data: Object.entries(roleLabels),
      getLabel: (r: Array<any>) => r[1].shortLabel,
      getValue: (r: Array<any>) => r[0] as UserRole,
      onFilterChange: (r: UserRole) => onFiltersChange({ ...filters, selcRole: [r] }),
    });
  };

  return (
    <Grid container direction="row" alignItems={'center'} columnSpacing={2}>
      <Grid item>
        {filters.selcRole.length > 0 ? (
          <Chip
            disabled={disableFilters}
            label={roleLabels[filters.selcRole[0]].shortLabel}
            onClick={onClickFilterRole}
            sx={chipSelectedStyle}
            variant={'filled'}
            onDelete={handleDeleteFilterRole}
            deleteIcon={<ClearIcon sx={{ color: '#FFFFFF !important' }} />}
          />
        ) : (
          <Chip
            disabled={disableFilters}
            label={'Ruoli'}
            onClick={onClickFilterRole}
            sx={chipStyle}
            variant={'outlined'}
            onDelete={undefined}
            deleteIcon={<ClearIcon />}
          />
        )}
      </Grid>
      <FilterModal
        handleClose={() => setOpenLogoutModal(false)}
        filterModalConfig={filterModalConfig}
        open={openLogoutModal}
        title={titleModal}
        height="100%"
      />
    </Grid>
  );
}