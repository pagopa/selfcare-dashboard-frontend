import { Grid } from '@mui/material';
import { roleLabels } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { userSelectors } from '../../../redux/slices/userSlice';
import LogoSubMenu from './components/LogoSubMenu';
import DashboardSubMenu from './components/DashboardSubMenu';

const DashboardMenuContainer = () => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const user = useAppSelector(userSelectors.selectLoggedUser);

  return selectedParty ? (
    <Grid container item direction="row" xs={6} alignContent="center" justifyContent="end">
      <Grid item xs={5}>
        <LogoSubMenu
          urlLogo={selectedParty.urlLogo}
          title={selectedParty.description}
          subTitle={roleLabels[selectedParty.role]}
        />
      </Grid>
      <Grid item xs={1}>
        <DashboardSubMenu
          ownerName={`${user?.name} ${user?.surname}`}
          selectedParty={selectedParty}
          urlLogo={selectedParty.urlLogo}
          description={selectedParty.description}
          role={roleLabels[selectedParty.role]}
        />
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};

export default DashboardMenuContainer;
