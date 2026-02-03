import CloseIcon from '@mui/icons-material/Close';
import { Drawer, Grid, IconButton, Link, Typography, styled } from '@mui/material';
import { useLoading } from '@pagopa/selfcare-common-frontend/lib';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { LINK_UPLOAD_GUIDELINES_SEND } from '../../../../utils/constants';
import { DashboardInfoBanner } from './components/DashboardInfoBanner';
import PartyDetail from './components/PartyDetail';
import { PartyLogoUploader } from './components/partyLogoUploader/PartyLogoUploader';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  party: Party;
  canUploadLogo: boolean;
  canUploadLogoOnSendProduct: boolean;
  showGeoTaxonomyForInstitutionType: boolean;
  setOpenModalAddNewGeographicTaxonomies: (open: boolean) => void;
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
  party,
  open,
  setOpen,
  canUploadLogo,
  canUploadLogoOnSendProduct,
  showGeoTaxonomyForInstitutionType,
  setOpenModalAddNewGeographicTaxonomies,
}: Props) => {
  const { t } = useTranslation();
  const setLoading = useLoading('DRAWER_PARTY_DETAIL');
  const institutionTypesList = useAppSelector(partiesSelectors.selectPartySelectedInstitutionTypes);

  const [clearCache, setclearCache] = useState(false);

  const showInfoBanner = institutionTypesList?.includes('PA');

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
        <Grid item xs={12} textAlign={'end'} mb={2}>
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
          {isPagoPaUser ? t('overview.viewDetails') : t('overview.changeDetails')}
        </Typography>
        <Grid item xs={12}>
          <PartyLogoUploader
            partyId={party.partyId}
            canUploadLogo={canUploadLogo}
            setclearCache={setclearCache}
          />
        </Grid>
        {canUploadLogoOnSendProduct && (
          <Grid item xs={12} mb={1}>
            <Typography
              sx={{ fontSize: '14px', fontWeight: 'fontWeightRegular', color: 'text.secondary' }}
            >
              <Trans
                i18nKey="overview.partyLogo.uploadSendLogoGuide"
                components={{
                  1: (
                    <Link
                      href={LINK_UPLOAD_GUIDELINES_SEND}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontWeight: 'fontWeightMedium' }}
                    />
                  ),
                }}
              />
            </Typography>
          </Grid>
        )}
        {showInfoBanner && (
          <Grid item xs={12} my={2}>
            <DashboardInfoBanner />
          </Grid>
        )}

        <PartyDetail
          party={party}
          institutionTypesList={institutionTypesList}
          setOpenModalAddNewGeographicTaxonomies={setOpenModalAddNewGeographicTaxonomies}
          showGeoTaxonomyForInstitutionType={showGeoTaxonomyForInstitutionType}
        />
      </Grid>
    </CustomDrawer>
  );
};
