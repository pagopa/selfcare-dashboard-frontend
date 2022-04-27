import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import {
  IconButton,
  Grid,
  Divider,
  Button,
  Popper,
  ClickAwayListener,
  Paper,
  useTheme,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useHistory } from 'react-router';
import { uniqueId } from 'lodash';
import styled from '@emotion/styled';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import PartySelectionSearch from '../../../partySelectionSearch/PartySelectionSearch';
import ROUTES from '../../../../routes';
import { ENV } from '../../../../utils/env';
import { useParties } from '../../../../hooks/useParties';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../../../redux/slices/partiesSlice';
import LogoSubMenu from './LogoSubMenu';

const CustomIconButton = styled(IconButton)({
  '&:hover': { backgroundColor: 'transparent' },
});

type Props = {
  ownerName: string;
  description: string;
  role: string;
  selectedParty: Party;
};

export default function DashboardSubMenu({ ownerName, description, role, selectedParty }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const history = useHistory();
  const parties = useAppSelector(partiesSelectors.selectPartiesList);
  const setParties = (parties: Array<Party>) => dispatch(partiesActions.setPartiesList(parties));
  const [parties2Show, setParties2Show] = useState<Array<Party>>();
  const addError = useErrorDispatcher();
  const fetchParties = useParties();
  const theme = useTheme();

  const onExit = useUnloadEventOnExit();

  const doFetch = (): void => {
    fetchParties()
      .then((parties) => {
        setParties(parties);
        setParties2Show(
          parties.filter((p) => p.status === 'ACTIVE' && p.partyId !== selectedParty.partyId)
        );
      })
      .catch((reason) => {
        addError({
          id: uniqueId('dashboardSubmenu-'),
          blocking: false,
          error: reason,
          techDescription: 'An error occurred while fetching parties opening dashboard submenu',
          onRetry: doFetch,
          toNotify: true,
        });
      });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (!parties) {
      doFetch();
    } else {
      setParties2Show(
        parties.filter((p) => p.status === 'ACTIVE' && p.partyId !== selectedParty.partyId)
      );
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container justifyContent="center" sx={{ height: '100%' }}>
      <Grid item>
        <CustomIconButton onClick={handleClick} sx={{ height: '100%' }} disableRipple={true}>
          {open ? (
            <ExpandLess sx={{ color: theme.palette.text.primary }} />
          ) : (
            <ExpandMore sx={{ color: theme.palette.text.primary }} />
          )}
        </CustomIconButton>
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          style={{ zIndex: 200 }}
        >
          <ClickAwayListener onClickAway={handleClose}>
            <Paper
              sx={{
                style: {
                  boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)',
                  borderRadius: '0px 0px 3px 3px',
                  width: '392px',
                  marginTop: '15px',
                },
              }}
            >
              <Grid container px={4} width="392px" maxHeight="560px">
                <Grid item xs={12} mt={4} mb={4}>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: '26px', color: theme.palette.text.primary }}
                  >
                    {ownerName}
                  </Typography>
                </Grid>
                <Grid item xs={10} mb={4}>
                  <LogoSubMenu
                    title={description}
                    subTitle={role}
                    color={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ borderColor: '#CCD4DC' }} />
                </Grid>
                <Grid item mb={3} xs={12}>
                  {parties2Show && (
                    <PartySelectionSearch
                      partyTitle={t('subHeader.partySelectionSearch.title')}
                      pxTitleSubTitle="32px"
                      iconMarginRight="-10px"
                      showAvatar={false}
                      iconColor="#0073E6"
                      label={t('subHeader.partySelectionSearch.label')}
                      disableUnderline={true}
                      parties={parties2Show}
                      onPartySelectionChange={(selectedParty: Party | null) => {
                        if (selectedParty) {
                          handleClose();
                          trackEvent('DASHBOARD_PARTY_SELECTION', {
                            party_id: selectedParty.partyId,
                          });
                          onExit(() =>
                            history.push(
                              resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, {
                                institutionId: selectedParty.partyId,
                              })
                            )
                          );
                        }
                      }}
                    />
                  )}
                </Grid>
                <Grid container item mb={3} justifyContent="center">
                  <Grid item xs={8}>
                    <Button
                      variant="contained"
                      sx={{ height: '40px', width: '100%' }}
                      onClick={() => window.location.assign(ENV.URL_FE.LOGOUT)}
                    >
                      {t('subHeader.backButton')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </Grid>
    </Grid>
  );
}
