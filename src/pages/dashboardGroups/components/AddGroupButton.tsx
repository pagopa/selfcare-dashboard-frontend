import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../model/Party';
import { DASHBOARD_ROUTES } from '../../../routes';

interface AddGroupButtonProps {
  party: Party;
}

export default function AddGroupButton({ party }: AddGroupButtonProps) {
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
  const { t } = useTranslation();

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon sx={{ stroke: 'white', strokeWidth: '1px' }} />}
      sx={{ py: '10px' }}
      onClick={() =>
        onExit(() =>
          history.push(
            resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_ADD.path, {
              institutionId: party.institutionId,
            })
          )
        )
      }
    >
      {t('dashboardGroup.addGroupButton.createActionLabel')}
    </Button>
  );
}
