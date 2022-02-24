import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect } from 'react';
import { Box, Button, FormControl, Select, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/system';
import { ProductRole, productRolesGroupBySelcRole } from '../../../../model/ProductRole';
import { UserRole } from '../../../../model/Party';
import { UsersTableFiltersConfig } from './UsersTableFilters';

const CustomSelect = styled(Select)({
  '.MuiInput-root': {
    cursor: 'default',
  },
  '.MuiSelect-select.MuiSelect-standard.MuiInput-input.MuiInputBase-input': {
    cursor: 'default',
  },
});
const MenuProps = {
  PaperProps: {
    style: {
      marginLeft: '12px',
    },
  },
};
type Props = {
  productRolesList: Array<ProductRole>;
  productRolesSelected: Array<ProductRole>;
  filterSelcRole: Array<UserRole>;
  filters: UsersTableFiltersConfig;
  onFiltersChange: (f: UsersTableFiltersConfig) => void;
};

type ProductRolesGroupByTitle = { [title: string]: Array<ProductRole> };

const productRolesGroupByTitle = (roles: Array<ProductRole>): ProductRolesGroupByTitle =>
  roles.reduce((acc, r) => {
    // eslint-disable-next-line functional/immutable-data
    acc[r.title] = (acc[r.title] ?? []).concat([r]);
    return acc;
  }, {} as ProductRolesGroupByTitle);

const emptySelcRoleGroup = { ADMIN: {}, LIMITED: {} };

export default function UsersTableRolesFilter({
  productRolesSelected,
  productRolesList,
  onFiltersChange,
  filters,
}: Props) {
  const productList = (productRoles: Array<ProductRole>) =>
    Object.fromEntries(
      Object.entries(productRolesGroupBySelcRole(productRoles)).map(([selcRole, roles]) => [
        selcRole,
        productRolesGroupByTitle(roles),
      ])
    ) as {
      [selcRole in UserRole]: ProductRolesGroupByTitle;
    };

  const selcRoleGroup = productList(productRolesList);
  const productFiltered = productList(productRolesSelected);
  const selcGroups = Object.keys(selcRoleGroup) as Array<UserRole>;

  const [open, setOpen] = React.useState(false);
  const [productRoleCheckedBySelcRole, setProductRoleCheckedBySelcRole] = React.useState<{
    [selcRole in UserRole]: ProductRolesGroupByTitle;
  }>(emptySelcRoleGroup);

  const nextProductRolesFilter = Object.values(productRoleCheckedBySelcRole)
    .flatMap((groupByTitle) => Object.values(groupByTitle))
    .flatMap((x) => x);

  useEffect(() => {
    if (productRolesSelected) {
      setProductRoleCheckedBySelcRole(productFiltered);
    } else {
      setProductRoleCheckedBySelcRole(emptySelcRoleGroup);
    }
  }, [productRolesSelected]);

  const checked = () => {
    // eslint-disable-next-line functional/no-let
    let check = false;
    selcGroups.forEach((group) => {
      if (
        productRoleCheckedBySelcRole[group] &&
        Object.keys(productRoleCheckedBySelcRole[group]) &&
        Object.keys(productRoleCheckedBySelcRole[group]).length > 0
      ) {
        check = true;
      }
    });
    return check;
  };

  const children = (
    selcRole: UserRole,
    selcGroup: ProductRolesGroupByTitle,
    selcGroupSelected: ProductRolesGroupByTitle
  ) => (
    <Box key={`${selcRole}-children`} sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
      {Object.entries(selcGroup).map(([title, roles]) => {
        const isSelected = !!selcGroupSelected[title];
        return (
          <FormControlLabel
            key={title}
            label={title}
            control={
              <Checkbox
                checked={isSelected}
                onChange={() => {
                  const nextSelcGroupSelected = isSelected
                    ? Object.fromEntries(
                        Object.entries(selcGroupSelected).filter(([t, _rs]) => t !== title)
                      )
                    : { ...selcGroupSelected, [title]: roles };
                  setProductRoleCheckedBySelcRole({
                    ...productRoleCheckedBySelcRole,
                    [selcRole]: nextSelcGroupSelected,
                  });
                }}
              />
            }
          />
        );
      })}
    </Box>
  );

  return (
    <Box>
      <FormControl sx={{ width: 300 }} variant="standard">
        <CustomSelect
          multiple
          MenuProps={MenuProps}
          variant="standard"
          displayEmpty
          native={false}
          onClose={() => {
            setOpen(false);
            setProductRoleCheckedBySelcRole(productFiltered);
          }}
          open={open}
          IconComponent={() =>
            open ? (
              <KeyboardArrowDownIcon
                id="keyboardArrowDownIcon"
                color="primary"
                sx={{ transform: 'rotate(-180deg)', cursor: 'pointer' }}
              />
            ) : (
              <KeyboardArrowDownIcon
                id="keyboardArrowDownIcon"
                color="primary"
                sx={{ transform: 'rotate(0deg)', cursor: 'pointer' }}
                onClick={() => {
                  setOpen(true);
                }}
              />
            )
          }
          inputProps={{ onClick: () => setOpen(!open) }}
          value={Object.values(productRoleCheckedBySelcRole).flatMap((titles) =>
            Object.keys(titles)
          )}
          renderValue={(selected: any) => {
            if (selected.length === 0) {
              return <Box sx={{ fontStyle: 'normal', cursor: 'default' }}>Tutti i ruoli</Box>;
            }
            return selected.join(', ');
          }}
          sx={{
            '.MuiInput-input:focus': { backgroundColor: 'transparent' },
          }}
        >
          <Box px={3}>
            {selcGroups.map((selcRole) => {
              const selcGroupSelected = productRoleCheckedBySelcRole[selcRole];
              const selcGroup = selcRoleGroup[selcRole];
              const isSelected =
                Object.keys(selcGroupSelected).length === Object.keys(selcGroup).length;

              return [
                <FormControlLabel
                  key={selcRole}
                  label={selcRole}
                  control={
                    <Checkbox
                      checked={isSelected}
                      indeterminate={!isSelected && Object.keys(selcGroupSelected).length > 0}
                      onChange={() => {
                        const nextSelcGroupSelected = isSelected ? {} : { ...selcGroup };
                        setProductRoleCheckedBySelcRole({
                          ...productRoleCheckedBySelcRole,
                          [selcRole]: nextSelcGroupSelected,
                        });
                      }}
                    />
                  }
                />,
                children(selcRole, selcGroup, selcGroupSelected),
              ];
            })}
            <Grid container spacing={1} display="flex" justifyContent="center" py={3}>
              <Grid item xs={12}>
                <Button
                  disabled={!checked() && productRolesSelected !== nextProductRolesFilter}
                  sx={{ width: '100%', height: '32px' }}
                  color="primary"
                  variant="contained"
                  type="submit"
                  onClick={() => {
                    setOpen(false);
                    onFiltersChange({
                      ...filters,
                      selcRole: [],
                      productRoles: nextProductRolesFilter,
                    });
                  }}
                >
                  Filtra
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={!checked()}
                  sx={{ width: '100%', height: '32px' }}
                  color="primary"
                  variant="outlined"
                  type="submit"
                  onClick={() => {
                    setOpen(false);
                    onFiltersChange({ ...filters, selcRole: [], productRoles: [] });
                  }}
                >
                  Cancella filtri
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CustomSelect>
      </FormControl>
    </Box>
  );
}
