import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { Party } from '../../../model/Party';

interface AddGroupButtonProps {
  party: Party;
}

export default function AddGroupButton({ party }: AddGroupButtonProps) {
  const history = useHistory();
  const onExit = useUnloadEventOnExit();

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      sx={{ py: '10px' }}
      onClick={() =>
        onExit(() =>
          history.push('', /* TODO use add Group route */ { institutionId: party.institutionId })
        )
      }
    >
      Crea
    </Button>
  );
}
