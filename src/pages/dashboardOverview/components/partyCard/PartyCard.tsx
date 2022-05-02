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
        boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)',
        py: 3,
        px: 2,
        backgroundColor: '#EEEEEE',
        border: 'none',
      }}
    >
      <PartyDetail party={party} />
    </Card>
  );
}
