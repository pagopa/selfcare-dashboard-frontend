import { ListItemButton, ListItemText, ListItemIcon, Icon, Collapse, List } from '@mui/material';
import { ExpandLess, ExpandMore, SvgIconComponent } from '@mui/icons-material';
import React from 'react';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  isSubMenuSelected?: boolean;
  icon: SvgIconComponent;
  subMenuVisible: boolean;
  subMenuIcon?: SvgIconComponent;
  subMenuTitle?: string;
  handleClickSubMenu?: () => void;
};

export default function DashboardSidenavItem({
  handleClick,
  handleClickSubMenu,
  title,
  isSelected,
  isSubMenuSelected,
  icon,
  subMenuVisible,
  subMenuIcon,
  subMenuTitle,
}: Props) {
  const [open, setOpen] = React.useState(true);

  const handleOpen = () => {
    setOpen(!open);
  };

  const isSubMenuPresent = subMenuVisible && subMenuIcon && handleClickSubMenu;
  return (
    <List disablePadding>
      <ListItemButton
        selected={isSelected}
        onClick={() => {
          handleClick();
          handleOpen();
        }}
        sx={{
          height: '100%',
          maxWidth: 360,
          backgroundColor: 'background.paper',
        }}
      >
        <ListItemIcon>
          <Icon component={icon} />
        </ListItemIcon>

        <ListItemText primary={title} />
        {isSubMenuPresent && <> {open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItemButton>
      {isSubMenuPresent && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              selected={isSubMenuSelected ?? false}
              sx={{ pl: 4, height: '100%', maxWidth: 360, backgroundColor: 'background.paper' }}
              onClick={() => {
                handleClickSubMenu();
              }}
            >
              <ListItemIcon>
                <Icon component={subMenuIcon} />
              </ListItemIcon>
              <ListItemText primary={subMenuTitle} />
            </ListItemButton>
          </List>
        </Collapse>
      )}
    </List>
  );
}
