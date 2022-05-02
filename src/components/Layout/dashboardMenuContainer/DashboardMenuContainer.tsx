import { Grid, useTheme } from '@mui/material';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import LogoSubMenu from './components/LogoSubMenu';
import DashboardSubMenu from './components/DashboardSubMenu';

const DashboardMenuContainer = () => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const user = useAppSelector(userSelectors.selectLoggedUser);
  const theme = useTheme();

  const { t } = useTranslation();

  return selectedParty ? (
    <Grid container item direction="row" xs={6} alignContent="center" justifyContent="flex-end">
      <Grid item xs={5}>
        <LogoSubMenu
          title={selectedParty.description}
          subTitle={t(roleLabels[selectedParty.userRole].longLabelKey)}
          color={theme.palette.text.primary}
        />
      </Grid>
      <Grid item xs={1} sx={{ height: '100%' }}>
        <DashboardSubMenu
          ownerName={`${user?.name} ${user?.surname}`}
          selectedParty={selectedParty}
          description={selectedParty.description}
          role={t(roleLabels[selectedParty.userRole].longLabelKey)}
        />
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};

export default DashboardMenuContainer;
