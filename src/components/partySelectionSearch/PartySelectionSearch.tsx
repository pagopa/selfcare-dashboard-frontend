import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Party } from '../../model/Party';
import { roleLabels } from '../../utils/constants';
import PartySelectionSearchInput from './PartySelectionSearchInput';
import PartyItemContainer from './PartyItemContainer';

type Props = {
  parties: Array<Party>;
  onPartySelectionChange: (selectedParty: Party | null) => void;
  disableUnderline?: boolean;
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
  height: '200px',
});

export default function PartySelectionSearch({
  parties,
  onPartySelectionChange,
  disableUnderline = false,
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
      <Grid item mb={3}>
        {parties.length > 3 && (
          <PartySelectionSearchInput
            disableUnderline={disableUnderline}
            label="Cerca"
            onChange={(e) => onFilterChange(e.target.value)}
            input={input}
          />
        )}
      </Grid>

      <Grid item>
        <CustomBox>
          {filteredParties &&
            filteredParties.map((party) => {
              const isDisabled = party.status === 'PENDING';
              return (
                <PartyItemContainer
                  isDisabled={isDisabled}
                  disabled={isDisabled}
                  key={party.institutionId}
                  borderList={selectedParty === party ? '2px solid #0073E6' : 'transparent'}
                  selectedItem={selectedParty === party}
                  title={party.description}
                  subTitle={roleLabels[party.platformRole]}
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
