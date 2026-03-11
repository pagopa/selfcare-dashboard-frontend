import { Box, Divider, Grid, List } from '@mui/material';
import { useLocation } from 'react-router';
import { Party } from '../../../../model/Party';
import DashboardSideNavItem from './DashboardSidenavItem';
import { useDashboardMenuItems } from './hooks/useDashboardMenuItems';

type Props = {
  party?: Party;
  isAddDelegateSectionVisible?: boolean;
  isInvoiceSectionVisible: boolean;
  isHandleDelegationsVisible?: boolean;
  isDocumentsSectionVisible?: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hideLabels?: boolean;
};

export default function DashboardSideMenu({
  party,
  isAddDelegateSectionVisible = false,
  isInvoiceSectionVisible = false,
  isHandleDelegationsVisible = false,
  isDocumentsSectionVisible = false,
  setDrawerOpen,
  hideLabels = false,
}: Readonly<Props>) {
  const location = useLocation();
  const isPagoPaOverviewVisible = !location.pathname.includes('admin');

  const visibleMenuItems = useDashboardMenuItems({
    party,
    isAddDelegateSectionVisible,
    isInvoiceSectionVisible,
    isHandleDelegationsVisible,
    isDocumentsSectionVisible,
    setDrawerOpen,
  });

  return (
    <Grid container item mt={1} width="100%">
      <Grid item xs={12}>
        <List>
          {visibleMenuItems.map((item) => (
            <Box key={item.key}>
              <DashboardSideNavItem
                title={hideLabels ? '' : item.title}
                icon={item.icon}
                handleClick={item.action}
                isSelected={item.isSelected}
                hideLabels={hideLabels}
                itemKey={item.key}
              />
              {(item.key === 'techpartner' ||
                (isPagoPaOverviewVisible && item.key === 'adminPage')) && (
                <Divider sx={{ mt: 2, mb: 2 }} />
              )}
            </Box>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
