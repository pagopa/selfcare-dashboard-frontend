import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { Party } from '../../model/Party';
import PartySelectionSearchInput from './PartySelectionSearchInput';
import PartyItemContainer from './PartyItemContainer';

type Props = {
  parties: Array<Party>;
  onPartySelectionChange: (selectedParty: Party | null) => void;
  disableUnderline?: boolean;
  label?: string;
  showAvatar?: boolean;
  iconColor?: string;
  iconMarginRight?: string;
  pxTitleSubTitle?: string;
};

const verifyPartyFilter = (party: Party, filter: string) =>
  party.description.toUpperCase().indexOf(filter.toUpperCase()) >= 0;
const CustomBox = styled(Box)({
  '&::-webkit-scrollbar': {
    width: 8,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: `inset 10px 10px  #E6E9F2`,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#0073E6',
  },
  overflowY: 'auto',
  height: '100%',
  maxHeight: '200px',
});

export default function PartySelectionSearch({
  parties,
  onPartySelectionChange,
  disableUnderline = false,
  label,
  showAvatar,
  iconColor,
  iconMarginRight,
  pxTitleSubTitle,
}: Props) {
  const [input, setInput] = useState('');
  const [filteredParties, setFilteredParties] = useState<Array<Party>>(parties);
  const [selectedParty, setSelectedParty] = React.useState<Party | null>(null);

  const onFilterChange = (value: string) => {
    setInput(value);
    if (!value) {
      setFilteredParties(parties);
    } else {
      setFilteredParties(parties?.filter((e) => verifyPartyFilter(e, value)));
    }
    if (value && selectedParty && !verifyPartyFilter(selectedParty, value)) {
      setSelectedParty(null);
      onPartySelectionChange(null);
    }
  };

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    party: Party
  ) => {
    setSelectedParty(party);
    onPartySelectionChange(party);
  };

  return (
    <Grid container item direction="column">
      <Grid item mt={3} mb={2}>
        {parties.length > 3 && (
          <Box>
            <PartySelectionSearchInput
              label={label}
              iconMarginRight={iconMarginRight}
              disableUnderline={disableUnderline}
              placeholder="Cerca"
              onChange={(e) => onFilterChange(e.target.value)}
              input={input}
              clearField={() => onFilterChange('')}
              iconColor={iconColor}
            />
          </Box>
        )}
      </Grid>

      <Grid item>
        <CustomBox sx={{ boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)' }}>
          {filteredParties &&
            filteredParties.map((party) => {
              const isDisabled = party.status === 'PENDING';
              return (
                <PartyItemContainer
                  pxTitleSubTitle={pxTitleSubTitle}
                  showAvatar={showAvatar}
                  isDisabled={isDisabled}
                  disabled={isDisabled}
                  key={party.institutionId}
                  borderList={selectedParty === party ? '2px solid #0073E6' : 'transparent'}
                  selectedItem={selectedParty === party}
                  title={party.description}
                  subTitle={roleLabels[party.userRole].longLabel}
                  titleColor={isDisabled ? '' : '#0073E6'}
                  image={party.urlLogo}
                  chip={party.status === 'PENDING' ? 'Da completare' : ''}
                  action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    handleListItemClick(event, party)
                  }
                />
              );
            })}
        </CustomBox>
      </Grid>
    </Grid>
  );
}
