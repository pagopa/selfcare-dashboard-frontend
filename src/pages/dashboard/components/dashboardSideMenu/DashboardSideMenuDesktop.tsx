// src/pages/dashboard/components/DashboardSideMenuDesktop.tsx
import DehazeIcon from '@mui/icons-material/Dehaze';
import { Box, Button, Divider, Grid } from '@mui/material';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { Party } from '../../../../model/Party';
import DashboardSideMenu from './DashboardSideMenu';

type Props = {
  party?: Party;
  isAddDelegateSectionVisible: boolean;
  isInvoiceSectionVisible: boolean;
  isHandleDelegationsVisible: boolean;
  isDocumentsSectionVisible: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  hideLabels: boolean;
  setHideLabels: Dispatch<SetStateAction<boolean>>;
};

const DashboardSideMenuDesktop: React.FC<Props> = ({
  party,
  isAddDelegateSectionVisible,
  isInvoiceSectionVisible,
  isHandleDelegationsVisible,
  isDocumentsSectionVisible,
  setDrawerOpen,
  hideLabels,
  setHideLabels,
}) => (
  <Grid
    id="dashboard-sidebar"
    component="nav"
    item
    xs={hideLabels ? 1 : 2}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
  >
    <Box sx={{ flexGrow: 1 }}>
      <DashboardSideMenu
        party={party}
        isAddDelegateSectionVisible={isAddDelegateSectionVisible}
        isInvoiceSectionVisible={isInvoiceSectionVisible}
        isHandleDelegationsVisible={isHandleDelegationsVisible}
        isDocumentsSectionVisible={isDocumentsSectionVisible}
        setDrawerOpen={setDrawerOpen}
        hideLabels={hideLabels}
      />
    </Box>

    <Box>
      <Divider sx={{ marginTop: '80px' }} />
      <Button
        fullWidth
        aria-label={
          hideLabels ? t('overview.sideMenu.titleExpand') : t('overview.sideMenu.titleCollapse')
        }
        aria-pressed={!hideLabels}
        aria-controls="dashboard-sidebar"
        sx={{
          height: '59px',
          display: 'flex',
          justifyContent: hideLabels ? 'center' : 'left',
          my: 3,
          color: 'text.primary',
        }}
        onClick={() => setHideLabels(!hideLabels)}
      >
        <DehazeIcon sx={{ marginRight: 2 }} />
      </Button>
    </Box>
  </Grid>
);

export default DashboardSideMenuDesktop;
