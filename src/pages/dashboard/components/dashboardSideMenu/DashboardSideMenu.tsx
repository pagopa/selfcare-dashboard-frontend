import { Divider, Grid, List, ListItem } from '@mui/material';
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

const MICROFRONTEND_ITEM_KEYS = ['users', 'groups'];

export default function DashboardSideMenu({
  party,
  isAddDelegateSectionVisible = false,
  isInvoiceSectionVisible = false,
  isHandleDelegationsVisible = false,
  isDocumentsSectionVisible = false,
  setDrawerOpen,
  hideLabels = false,
}: Readonly<Props>) {
  const visibleMenuItems = useDashboardMenuItems({
    party,
    isAddDelegateSectionVisible,
    isInvoiceSectionVisible,
    isHandleDelegationsVisible,
    isDocumentsSectionVisible,
    setDrawerOpen,
  });

  const firstMicrofrontendItemIndex = visibleMenuItems.findIndex((item) =>
    MICROFRONTEND_ITEM_KEYS.includes(item.key)
  );

  return (
    <Grid container item mt={1} width="100%">
      <Grid item xs={12}>
        <List>
          {visibleMenuItems.map((item, index) => (
            <ListItem key={item.key} disablePadding sx={{ display: 'block' }}>
              {index > 0 && index === firstMicrofrontendItemIndex && (
                <Divider data-testid="sidenav-divider" sx={{ my: 1 }} />
              )}
              <DashboardSideNavItem
                title={item.title}
                icon={item.icon}
                handleClick={item.action}
                isSelected={item.isSelected}
                hideLabels={hideLabels}
                itemKey={item.key}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
