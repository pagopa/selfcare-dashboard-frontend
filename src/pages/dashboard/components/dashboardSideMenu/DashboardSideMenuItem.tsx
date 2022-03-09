import React from 'react';
import { List, ListItem, Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { ExpandLess } from '@mui/icons-material';
import { ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';

export type MenuItem = {
  groupId: string;
  subMenu?: Array<MenuItem | undefined>;
  onClick?: () => void;
  title: string;
  active: boolean;
  isSelected?: () => boolean;
};

type Props = {
  item?: MenuItem;
  selectedItem: MenuItem | null;
  handleClick: (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, menuItem: any) => void;
  color?: string;
};

const DashboardSideMenuItem = ({ item, selectedItem, handleClick, color ='primary.main' }: Props) => {
  if (!item) {
    return <></>;
  }
  const isOpened = selectedItem?.groupId === item.groupId;
  const isSelected = item.isSelected && item.isSelected();
  const isAccordion = !!item.subMenu;
  const isSelectedAccordion = isSelected && isAccordion;
  const isSelectedAccordionLeaf = isSelected && !isAccordion;

  return (
    <React.Fragment key={item.title}>
      <ListItem
        disableRipple
        button
        sx={{
          color: 'primary.main',
          marginBottom: '8px',
          backgroundColor: 'transparent !important',
          borderRight: isSelectedAccordionLeaf ? '2px solid #0066CC' : undefined,
        }}
        disabled={!item.active}
        selected={isSelected}
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event, item)}
      >
        <Grid container>
          <Grid item xs={10}>
            <Typography
              variant="h6"
              sx={{
                fontSize: item.subMenu ? '18px' : '16px',
                color,
                fontWeight: isSelectedAccordion
                  ? '600'
                  : isSelected
                  ? '700'
                  : !isAccordion
                  ? '400'
                  : undefined,
              }}
            >
              {item.title}
            </Typography>
          </Grid>
          {item.subMenu && (
            <Grid item xs={2}>
              {isOpened ? (
                <ExpandLess sx={{ color }} />
              ) : (
                <ExpandMore sx={{ color }} />
              )}
            </Grid>
          )}
        </Grid>
      </ListItem>
      {item.subMenu && (
        <Collapse in={isOpened} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4, top: '-15px' }}>
            {item.subMenu
              .filter((x) => x)
              .map(
                (subItem) =>
                  subItem && (
                    <DashboardSideMenuItem
                      key={subItem.title}
                      item={subItem}
                      selectedItem={selectedItem}
                      handleClick={handleClick}
                    />
                  )
              )}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
};

export default DashboardSideMenuItem;
