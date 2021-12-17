import { Grid, Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { useState } from 'react';

// import { styled } from '@mui/system';
import { UserRole } from '../../../../../model/Party';
import FilterModal, { FilterModalConfig } from '../../../../../components/FilterModal';
import { Product } from '../../../../../model/Product';
import { roleLabels } from '../../../../../utils/constants';

interface UsersSearchFilterProps {
  filter: UsersSearchFilterConfig;
  onFilterChange: (f: UsersSearchFilterConfig) => void;
  filterProducts: boolean;
  data?: Array<Product> | Array<string>;
  products: Array<Product>;
}

const chipSelectedStyle = { backgroundColor: '#8B98A6', color: '#FFFFFF', width: '100%' };
const chipStyle = {
  backgroundColor: '#FCFDFF',
  color: '#5C6F82',
  width: '13ch',
  border: '1px solid #E6E9F2',
};

export type UsersSearchFilterConfig = {
  product?: Product;
  role?: UserRole;
};
export default function UsersSearchFilter({
  filter,
  onFilterChange,
  filterProducts,
  products,
}: UsersSearchFilterProps) {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [filterModalConfig, setFilterModalConfig] = useState<FilterModalConfig<any, any>>();
  const [titleModal, setTitleModal] = useState('');

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
      getLabel: (p: Product) => p.title,
      getValue: (p: Product) => p.id,
      onFilterChange: (p: Product) => onFilterChange({ ...filter, product: p }),
    });
  };

  const onClickFilterRole = () => {
    setOpenLogoutModal(true);
    setTitleModal('Ruoli');
    setFilterModalConfig({
      data: Object.entries(roleLabels),
      getLabel: (r: Array<any>) => r[1].shortLabel,
      getValue: (r: Array<any>) => r[0] as UserRole,
      onFilterChange: (r: UserRole) => onFilterChange({ ...filter, role: r }),
    });
  };

  return (
    <Grid container direction="row" alignItems={'center'} columnSpacing={2}>
      {filterProducts === true && (
        <Grid item>
          {filter.product ? (
            <Chip
              label={filter.product.title}
              onClick={onClickFilterProduct}
              sx={chipSelectedStyle}
              variant={'filled'}
              onDelete={handleDeleteFilterProduct}
              deleteIcon={<ClearIcon sx={{ color: '#FFFFFF !important' }} />}
            />
          ) : (
            <Chip
              label={'Prodotti'}
              onClick={onClickFilterProduct}
              sx={chipStyle}
              variant={'outlined'}
              onDelete={undefined}
              deleteIcon={<ClearIcon />}
            />
          )}
        </Grid>
      )}
      <Grid item>
        {filter.role ? (
          <Chip
            label={roleLabels[filter.role].shortLabel}
            onClick={onClickFilterRole}
            sx={chipSelectedStyle}
            variant={'filled'}
            onDelete={handleDeleteFilterRole}
            deleteIcon={<ClearIcon sx={{ color: '#FFFFFF !important' }} />}
          />
        ) : (
          <Chip
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
        height='100%'
      />
    </Grid>
  );
}
