import { Card, Grid } from '@mui/material';
import { Party } from '../../../../model/Party';
import PartyDetail from './components/PartyDetail';
import { FilePngUploader } from './components/partyLogoUploader/PartyLogoUploader';

type Props = {
  party: Party;
};

export default function PartyCard({ party }: Props) {
  const canUploadLogo = party.platformRole === 'ADMIN_REF' || party.platformRole === 'ADMIN';

  return (
    <Card
      variant="outlined"
      sx={{ width: '100%', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)', py: 5 }}
    >
      <Grid container direction="row" alignItems={'center'} px={4}>
        <Grid item xs={9}>
          <PartyDetail party={party} />
        </Grid>

        <Grid item xs={3}>
          <Grid container direction="column" alignItems={'center'}>
            <Grid item>
              <FilePngUploader institutionId={party.institutionId} canUploadLogo={canUploadLogo} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
