import {
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Icon,
  Collapse,
  List,
  Divider,
  Box,
} from '@mui/material';
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
  handleClickPtPage?: () => void;
  isPtPageVisible: boolean;
  ptIcon?: SvgIconComponent;
  ptTitle?: string;
  isPtSelected?: boolean;
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
  isPtPageVisible,
  ptIcon,
  ptTitle,
  isPtSelected,
  handleClickPtPage,
}: Props) {
  const [open, setOpen] = React.useState(true);

  const handleOpen = () => {
    setOpen(!open);
  };

  const isSubMenuPresent = subMenuVisible && subMenuIcon && handleClickSubMenu;
  return (
    <List disablePadding>
      {isPtPageVisible && ptIcon && handleClickPtPage && (
        <Box mb={2}>
          <ListItemButton
            selected={isPtSelected ?? false}
            onClick={() => {
              handleClickPtPage();
            }}
            sx={{
              height: '100%',
              maxWidth: 360,
              backgroundColor: 'background.paper',
            }}
          >
            <ListItemIcon>
              <Icon component={ptIcon} />
            </ListItemIcon>

            <ListItemText primary={ptTitle} />
          </ListItemButton>
          <Divider />
        </Box>
      )}
      <ListItemButton
        selected={isSelected}
        onClick={() => {
          handleClick();
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
        {isSubMenuPresent && !isPtPageVisible && (
          <>
            {open ? (
              <ExpandLess onClick={() => handleOpen()} />
            ) : (
              <ExpandMore onClick={() => handleOpen()} />
            )}
          </>
        )}
      </ListItemButton>
      {isSubMenuPresent && !isPtPageVisible && (
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
