import { Grid } from '@mui/material';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import LogoSubMenu from './components/LogoSubMenu';
import DashboardSubMenu from './components/DashboardSubMenu';

const DashboardMenuContainer = () => {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const user = useAppSelector(userSelectors.selectLoggedUser);

  return selectedParty ? (
    <Grid container item direction="row" xs={6} alignContent="center" justifyContent="flex-end">
      <Grid item xs={5}>
        <LogoSubMenu
          title={t('subHeader.logoSubMenu.selected.partyName', {
            partyName: `${selectedParty.description}`,
          })}
          subTitle={t('subHeader.logoSubMenu.selected.role', {
            role: `${roleLabels[selectedParty.userRole].longLabel}`,
          })}
          color="background.default"
        />
      </Grid>
      <Grid item xs={1} sx={{ height: '100%' }}>
        <DashboardSubMenu
          ownerName={`${user?.name} ${user?.surname}`}
          selectedParty={t('subHeader.dashboardSubMenu.selected.partyName', {
            partyName: `${selectedParty}`,
          })}
          description={t('subHeader.dashboardSubMenu.selected.description', {
            description: `${selectedParty.description}`,
          })}
          role={t('subHeader.dashboardSubMenu.selected.role', {
            role: `${roleLabels[selectedParty.userRole].longLabel}`,
          })}
        />
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};

export default DashboardMenuContainer;
