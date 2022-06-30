import { PartyAccountItem } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { Box, IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { Party } from '../../model/Party';

type Props = {
  selectedParty: Party | null;
  clearField: () => void;
};

export default function PartyAccountItemSelection({ selectedParty, clearField }: Props) {
  const { t } = useTranslation();
  return (
    <Box display="flex" p={2}>
      <Box width="100%">
        <PartyAccountItem
          partyName={selectedParty ? selectedParty.description : ''}
          partyRole={selectedParty ? t(roleLabels[selectedParty.userRole].longLabelKey) : ''}
          image={selectedParty?.urlLogo}
          maxCharactersNumberMultiLine={25}
        />
      </Box>
      <Box display="flex" alignItems="center">
        <IconButton onClick={clearField} id="clearIcon" aria-label="removeSelectionIcon">
          <ClearOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
