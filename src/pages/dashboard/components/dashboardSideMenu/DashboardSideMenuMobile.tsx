// src/pages/dashboard/components/DashboardSideMenuMobile.tsx
import DehazeIcon from '@mui/icons-material/Dehaze';
import { Button, Drawer, Grid } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import { getButtonText } from '../../utils/dashboard-utils';
import DashboardSideMenu from './DashboardSideMenu';

type Props = {
  party?: Party;
  isAddDelegateSectionVisible: boolean;
  isInvoiceSectionVisible: boolean;
  isHandleDelegationsVisible: boolean;
  isDocumentsSectionVisible: boolean;
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  hideLabels: boolean;
  currentPathname: string;
};

const DashboardSideMenuMobile: React.FC<Props> = ({
  party,
  isAddDelegateSectionVisible,
  isInvoiceSectionVisible,
  isHandleDelegationsVisible,
  isDocumentsSectionVisible,
  drawerOpen,
  setDrawerOpen,
  hideLabels,
  currentPathname,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Button
        fullWidth
        disableRipple
        sx={{
          height: '59px',
          justifyContent: 'left',
          boxShadow:
            'rgba(0, 43, 85, 0.1) 0px 2px 4px -1px, rgba(0, 43, 85, 0.05) 0px 4px 5px !important',
        }}
        onClick={() => setDrawerOpen(true)}
      >
        <DehazeIcon sx={{ marginRight: 2 }} />
        {getButtonText(currentPathname, t)}
      </Button>

      <Grid>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Grid item xs={2} component="nav" display={'inline-grid'}>
            <DashboardSideMenu
              party={party}
              isAddDelegateSectionVisible={isAddDelegateSectionVisible}
              isInvoiceSectionVisible={isInvoiceSectionVisible}
              isHandleDelegationsVisible={isHandleDelegationsVisible}
              isDocumentsSectionVisible={isDocumentsSectionVisible}
              setDrawerOpen={setDrawerOpen}
              hideLabels={hideLabels}
            />
          </Grid>
        </Drawer>
      </Grid>
    </>
  );
};

export default DashboardSideMenuMobile;
