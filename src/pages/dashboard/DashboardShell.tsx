import { Grid, SxProps, Theme, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Party } from '../../model/Party';
import DashboardSideMenuDesktop from './components/dashboardSideMenu/DashboardSideMenuDesktop';
import DashboardSideMenuMobile from './components/dashboardSideMenu/DashboardSideMenuMobile';

export type DashboardShellProps = {
  party?: Party;
  isAddDelegateSectionVisible: boolean;
  isInvoiceSectionVisible: boolean;
  isHandleDelegationsVisible: boolean;
  isDocumentsSectionVisible: boolean;
  hideSideMenu?: boolean;
  children: ReactNode;
  containerSx?: SxProps<Theme>;
  mainSx?: SxProps<Theme>;
};

const DashboardShell: React.FC<DashboardShellProps> = ({
  party,
  isAddDelegateSectionVisible,
  isInvoiceSectionVisible,
  isHandleDelegationsVisible,
  isDocumentsSectionVisible,
  hideSideMenu = false,
  children,
  containerSx,
  mainSx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideLabels, setHideLabels] = useState(false);

  return (
    <Grid
      container
      item
      xs={12}
      sx={[
        {
          backgroundColor: 'background.paper',
          justifyContent: 'flex-start',
        },
        containerSx as any,
      ]}
    >
      {!hideSideMenu &&
        (isMobile ? (
          <DashboardSideMenuMobile
            party={party}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            hideLabels={hideLabels}
            currentPathname={location.pathname}
            isAddDelegateSectionVisible={isAddDelegateSectionVisible}
            isInvoiceSectionVisible={isInvoiceSectionVisible}
            isHandleDelegationsVisible={isHandleDelegationsVisible}
            isDocumentsSectionVisible={isDocumentsSectionVisible}
          />
        ) : (
          <DashboardSideMenuDesktop
            party={party}
            hideLabels={hideLabels}
            setHideLabels={setHideLabels}
            setDrawerOpen={setDrawerOpen}
            isAddDelegateSectionVisible={isAddDelegateSectionVisible}
            isInvoiceSectionVisible={isInvoiceSectionVisible}
            isHandleDelegationsVisible={isHandleDelegationsVisible}
            isDocumentsSectionVisible={isDocumentsSectionVisible}
          />
        ))}

      <Grid
        item
        component="main"
        sx={[
          {
            backgroundColor: '#F4F5F8',
            justifyContent: 'flex-start',
          },
          mainSx as any,
        ]}
        display="flex"
        minHeight="100vh"
        flexDirection="column"
        alignItems="flex-start"
        pb={8}
        xs={12}
        lg={hideLabels ? 11 : 10}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default DashboardShell;
