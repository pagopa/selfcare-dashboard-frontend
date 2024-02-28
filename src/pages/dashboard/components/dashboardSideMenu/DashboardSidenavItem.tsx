import {
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Icon,
  List,
  Divider,
  Box,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
  handleClickPtPage?: () => void;
  isPtPageVisible?: boolean;
  ptIcon?: SvgIconComponent;
  ptTitle?: string;
  isPtSelected?: boolean;
};

export default function DashboardSidenavItem({
  handleClick,
  title,
  isSelected,
  icon,
  isPtPageVisible,
  ptIcon,
  ptTitle,
  isPtSelected,
  handleClickPtPage,
}: Props) {
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
      </ListItemButton>
    </List>
  );
}
