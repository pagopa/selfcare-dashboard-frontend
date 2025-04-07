import CloseIcon from '@mui/icons-material/Close';
import { Drawer, Grid, IconButton, Typography, styled } from '@mui/material';
import { useLoading } from '@pagopa/selfcare-common-frontend/lib';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import PartyDetail from '../partyCard/components/PartyDetail';
import { PartyLogoUploader } from '../partyCard/components/partyLogoUploader/PartyLogoUploader';
import { DashboardInfoBanner } from './DashboardInfoBanner';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  showInfoBanner: boolean;
  party: Party;
  canUploadLogo: boolean;
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

export const PartyDetailModal = ({
  showInfoBanner,
  party,
  open,
  setOpen,
  canUploadLogo,
}: Props) => {
  const { t } = useTranslation();
  const setLoading = useLoading('DRAWER_PARTY_DETAIL');
  const [clearCache, setclearCache] = useState(false);
  const reloadPage = () => {
    setclearCache(false);
    window.location.replace(window.location.href);
  };
  return (
    <CustomDrawer
      open={open}
      anchor="right"
      tabIndex={0}
      onClose={() => {
        setLoading(true);
        setOpen(false);
        if (clearCache) {
          reloadPage();
        }
        setLoading(false);
      }}
    >
      <Grid container px={3} pt={2} mb={5}>
        <Grid xs={12} textAlign={'end'} mb={2}>
          <IconButton
            color="default"
            aria-label="close instituion detail modal"
            component="span"
            onClick={() => {
              setOpen(false);
              if (clearCache) {
                reloadPage();
              }
            }}
            data-testid="close-modal-test"
          >
            <CloseIcon />
          </IconButton>
        </Grid>

        <Typography variant="h6" sx={{ fontWeight: '700' }} pb={3}>
          {t('overview.changeDetails')}
        </Typography>
        <Grid item xs={12}>
          <PartyLogoUploader
            partyId={party.partyId}
            canUploadLogo={canUploadLogo}
            setclearCache={setclearCache}
          />
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
};
