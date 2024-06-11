import {
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Icon,
  List,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
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
              backgroundColor: 'background.paper',
              width: isMobile ? '270px' :'100%'
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
          backgroundColor: 'background.paper',
          width: isMobile ? '270px' :'100%'
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
