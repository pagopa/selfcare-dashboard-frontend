import { Grid } from '@mui/material';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import LogoSubMenu from './components/LogoSubMenu';
import DashboardSubMenu from './components/DashboardSubMenu';

const DashboardMenuContainer = () => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const user = useAppSelector(userSelectors.selectLoggedUser);

  return selectedParty ? (
    <Grid container item direction="row" xs={6} alignContent="center" justifyContent="flex-end">
      <Grid item xs={5}>
        <LogoSubMenu
          title={selectedParty.description}
          subTitle={roleLabels[selectedParty.userRole].longLabel}
          color="background.default"
        />
      </Grid>
      <Grid item xs={1} sx={{ height: '100%' }}>
        <DashboardSubMenu
          ownerName={`${user?.name} ${user?.surname}`}
          selectedParty={selectedParty}
          description={selectedParty.description}
          role={roleLabels[selectedParty.userRole].longLabel}
        />
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};

export default DashboardMenuContainer;
