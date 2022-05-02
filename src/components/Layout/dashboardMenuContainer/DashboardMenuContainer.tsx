import { Grid, useTheme } from '@mui/material';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
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
          subTitle={
            selectedParty.userRole === 'ADMIN'
              ? t('common.roles.admin.longLabel')
              : t('common.roles.limited.longLabel')
          }
          color={theme.palette.text.primary}
        />
      </Grid>
      <Grid item xs={1} sx={{ height: '100%' }}>
        <DashboardSubMenu
          ownerName={`${user?.name} ${user?.surname}`}
          selectedParty={selectedParty}
          description={selectedParty.description}
          role={
            selectedParty.userRole === 'ADMIN'
              ? t('common.roles.admin.longLabel')
              : t('common.roles.limited.longLabel')
          }
        />
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};

export default DashboardMenuContainer;
