import { Card } from '@mui/material';
import { Party } from '../../../../model/Party';
import PartyDetail from './components/PartyDetail';
// import { PartyLogoUploader } from './components/partyLogoUploader/PartyLogoUploader';

type Props = {
  party: Party;
};

export default function PartyCard({ party }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        py: 3,
        px: 1,
        backgroundColor: '#EEEEEE',
        border: 'none',
      }}
    >
      <PartyDetail party={party} />
    </Card>
  );
}
