import { SvgIconComponent } from '@mui/icons-material';
import {
  Box,
  Divider,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
  handleClickPtPage?: () => void;
  isHandleDelegationsVisible?: boolean;
  ptIcon?: SvgIconComponent;
  ptTitle?: string;
  isPtSelected?: boolean;
  hideLabels?: boolean;
};

export default function DashboardSidenavItem({
  handleClick,
  title,
  isSelected,
  icon,
  isHandleDelegationsVisible,
  ptIcon,
  ptTitle,
  isPtSelected,
  handleClickPtPage,
  hideLabels,
}: Readonly<Props>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <List disablePadding>
      {isHandleDelegationsVisible && ptIcon && handleClickPtPage && (
        <Box mb={2}>
          <ListItemButton
            selected={isPtSelected ?? false}
            onClick={() => {
              handleClickPtPage();
            }}
            sx={{
              height: '100%',
              backgroundColor: 'background.paper',
              width: isMobile ? '270px' : '100%',
              display: hideLabels ? 'grid' : '',
              justifyContent: hideLabels ? 'center' : '',
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
          width: isMobile ? '270px' : '100%',
          display: hideLabels ? 'grid' : '',
          justifyContent: hideLabels ? 'center' : '',
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
