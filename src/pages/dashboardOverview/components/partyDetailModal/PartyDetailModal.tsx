import CloseIcon from '@mui/icons-material/Close';
import { Drawer, Grid, IconButton, Typography, styled } from '@mui/material';
import { Party } from '../../../../model/Party';
import PartyDetail from '../partyCard/components/PartyDetail';
import { PartyLogoUploader } from '../partyCard/components/partyLogoUploader/PartyLogoUploader';
import { DashboardInfoBanner } from './DashboardInfoBanner';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  showInfoBanner: boolean;
  party: Party;
  isAdmin: boolean;
};

const CustomDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: '30vw',
  },
  ['@media only screen and (max-width: 576px)']: {
    '& .MuiDrawer-paper': {
      width: '100vw',
    },
  },
  ['@media only screen and (min-width: 577px) and (max-width: 992px)']: {
    '& .MuiDrawer-paper': {
      width: '40vw',
    },
  },
}));

export const PartyDetailModal = ({ showInfoBanner, party, open, setOpen, isAdmin }: Props) => (
  <CustomDrawer open={open} anchor="right" tabIndex={0} onClose={() => setOpen(false)}>
    <Grid container p={3}>
      <Grid xs={12} textAlign={'end'}>
        <IconButton
          color="default"
          aria-label="close instituion detail modal"
          component="span"
          onClick={(e: any) => console.log(e)}
          data-testid="close-modal-test"
        >
          <CloseIcon />
        </IconButton>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: '700' }}>
        Gestisci i dati dell’ente
      </Typography>
      <Grid item xs={12}>
        <PartyLogoUploader partyId={party.partyId} canUploadLogo={isAdmin} />
      </Grid>
      {showInfoBanner && (
        <Grid item xs={12} my={2}>
          <DashboardInfoBanner />
        </Grid>
      )}

      <PartyDetail party={party} />
    </Grid>
  </CustomDrawer>
);
