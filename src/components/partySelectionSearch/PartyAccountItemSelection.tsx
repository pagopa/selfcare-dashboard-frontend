import { PartyAccountItem } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { roleLabels } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { Box, IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { BaseParty } from '../../model/Party';

type Props = {
  selectedParty: BaseParty | null;
  clearField: () => void;
};

export default function PartyAccountItemSelection({ selectedParty, clearField }: Props) {
  const { t } = useTranslation();
  return (
    <Box display="flex" p={2}>
      <Box width="100%">
        <PartyAccountItem
          partyName={selectedParty?.description ?? ''}
          partyRole={
            selectedParty?.userRole ? t(roleLabels[selectedParty.userRole].longLabelKey) : ''
          }
          image={selectedParty?.urlLogo ?? ''}
          maxCharactersNumberMultiLine={20}
          noWrap={false}
          parentPartyName={
            selectedParty && selectedParty.parentDescription ? selectedParty.parentDescription : ''
          }
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
