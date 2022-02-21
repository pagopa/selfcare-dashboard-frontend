import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect } from 'react';
import { Box, FormControl, InputLabel, OutlinedInput, Select } from '@mui/material';
import { ProductRole, productRolesGroupBySelcRole } from '../../../../model/ProductRole';
import { UserRole } from '../../../../model/Party';

type Props = {
  selcRoleGroup: { [selcRole in UserRole]: ProductRolesGroupByTitle };
  productRoles: Array<ProductRole>;
};

type ProductRolesGroupByTitle = { [title: string]: Array<ProductRole> };

const productRolesGroupByTitle = (roles: Array<ProductRole>): ProductRolesGroupByTitle =>
  roles.reduce((acc, r) => {
    // eslint-disable-next-line functional/immutable-data
    acc[r.title] = (acc[r.title] ?? []).concat([r]);
    return acc;
  }, {} as ProductRolesGroupByTitle);

const emptySelcRoleGroup = { ADMIN: {}, LIMITED: {} };

export default function UsersTableRolesFilter({ selcRoleGroup, productRoles }: Props) {
  const selcGroups = Object.keys(selcRoleGroup) as Array<UserRole>;

  const [productRoleCheckedBySelcRole, setProductRoleCheckedBySelcRole] = React.useState<{
    [selcRole in UserRole]: ProductRolesGroupByTitle;
  }>(emptySelcRoleGroup);

  useEffect(() => {
    if (productRoles) {
      setProductRoleCheckedBySelcRole(
        Object.fromEntries(
          Object.entries(productRolesGroupBySelcRole(productRoles)).map(([selcRole, roles]) => [
            selcRole,
            productRolesGroupByTitle(roles),
          ])
        ) as {
          [selcRole in UserRole]: ProductRolesGroupByTitle;
        }
      );
    } else {
      setProductRoleCheckedBySelcRole(emptySelcRoleGroup);
    }
  }, [productRoles]);

  const children = (
    selcRole: UserRole,
    selcGroup: ProductRolesGroupByTitle,
    selcGroupSelected: ProductRolesGroupByTitle
  ) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
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
    <>
      <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={Object.values(productRoleCheckedBySelcRole).flatMap((titles) =>
              Object.keys(titles)
            )}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
          >
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
          </Select>
        </FormControl>
      </div>
    </>
  );
}
