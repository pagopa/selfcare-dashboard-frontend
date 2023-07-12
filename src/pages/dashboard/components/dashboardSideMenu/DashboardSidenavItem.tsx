import {
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Icon,
  ListItem,
  Collapse,
  List,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import React from 'react';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
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
  icon,
  subMenuVisible,
  subMenuIcon,
  subMenuTitle,
}: Props) {
  const [open, setOpen] = React.useState(true);

  const handleHopen = () => {
    setOpen(!open);
  };

  const isSubMenuPresent = subMenuVisible && subMenuIcon && handleClickSubMenu;
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isSelected}
        onClick={() => {
          handleClick();
          handleHopen();
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
      </ListItemButton>
      {isSubMenuPresent && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
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
    </ListItem>
  );
}
