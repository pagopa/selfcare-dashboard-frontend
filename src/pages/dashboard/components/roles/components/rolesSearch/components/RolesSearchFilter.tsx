import { Grid, Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { useState } from 'react';

// import { styled } from '@mui/system';
import { UserPlatformRole } from '../../../../../../../model/Party';
import FilterModal, { FilterModalConfig } from '../../../../../../../components/FilterModal';
import { Product } from '../../../../../../../model/Product';
import { roleLabels } from '../../../../../../../utils/constants';

// const CustomChip = styled(Chip)({
//   '&.UserRoles': {
//     '&:hover': { backgroundColor: '#8B98A6 !important', color: 'white' },
//   },
// });

interface RolesSearchFilterProps {
  filter: RolesSearchFilterConfig;
  onFilterChange: (f: RolesSearchFilterConfig) => void;
  filterProducts: boolean;
  data?: Array<Product> | Array<string>;
  products: Array<Product>;
}
/* interface SearchFilterElement {
  id: string;
  title: string;
} */

export type RolesSearchFilterConfig = {
  product?: Product;
  role?: UserPlatformRole;
};
export default function RolesSearchFilter({
  filter,
  onFilterChange,
  filterProducts,
  products,
}: RolesSearchFilterProps) {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [filterModalConfig, setFilterModalConfig] = useState<FilterModalConfig<any, any>>();
  const [titleModal, setTitleModal] = useState('');
  /* const extractLabelsAndIdsFromProductLists = (f: Product) =>
  return {
      id: value.id,
      label: value.description,
    
   const extractLabelsAndIdsFromRoleLists = (f: Record<string, string>) => {
    const c = Object.keys(f);
    return console.log(c);
  }; */
  const handleDeleteFilterProduct = () => {
    onFilterChange({ ...filter, product: undefined });
  };
  const handleDeleteFilterRole = () => {
    onFilterChange({ ...filter, role: undefined });
  };

  const onClickFilterProduct = () => {
    setOpenLogoutModal(true);
    setTitleModal('Prodotti');
    setFilterModalConfig({
      data: products,
      getLabel: (p: Product) => p.title ?? '', // TODO description is mandatory fix me after merge
      getValue: (p: Product) => p.id,
      onFilterChange: (p: Product) => onFilterChange({ ...filter, product: p }),
    });
  };

  const onClickFilterRole = () => {
    setOpenLogoutModal(true);
    setTitleModal('Ruoli');
    setFilterModalConfig({
      data: Object.entries(roleLabels),
      getLabel: (r: Array<string>) => r[1],
      getValue: (r: Array<string>) => r[0] as UserPlatformRole,
      onFilterChange: (r: UserPlatformRole) => onFilterChange({ ...filter, role: r }),
    });
  };

  return (
    <Grid container direction="row" alignItems={'center'} px={4}>
      {filterProducts === true ? (
        <Grid item xs={4}>
          {filter.product ? (
            <Chip
              className="UserProducts"
              label={filter.product.title}
              onClick={onClickFilterProduct}
              sx={{
                backgroundColor: '#8B98A6',
                color: '#FFFFFF',
              }}
              variant={'filled'}
              onDelete={handleDeleteFilterProduct}
              deleteIcon={<ClearIcon sx={{ color: '#FFFFFF !important' }} />}
            />
          ) : (
            <Chip
              className="UserProducts"
              label={'Prodotti'}
              onClick={onClickFilterProduct}
              sx={{
                backgroundColor: undefined,
                color: '#5C6F82',
              }}
              variant={'outlined'}
              onDelete={undefined}
              deleteIcon={<ClearIcon />}
            />
          )}
        </Grid>
      ) : (
        <Grid item xs={4}></Grid>
      )}
      <Grid item xs={4}>
        {filter.role ? (
          <Chip
            className="UserRoles"
            label={roleLabels[filter.role]}
            onClick={onClickFilterRole}
            sx={{
              backgroundColor: '#8B98A6',
              color: '#FFFFFF',
            }}
            variant={'filled'}
            onDelete={handleDeleteFilterRole}
            deleteIcon={<ClearIcon sx={{ color: '#FFFFFF !important' }} />}
          />
        ) : (
          <Chip
            className="UserRoles"
            label={'Ruoli'}
            onClick={onClickFilterRole}
            sx={{
              backgroundColor: undefined,
              color: '#5C6F82',
            }}
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
      />
    </Grid>
  );
}
