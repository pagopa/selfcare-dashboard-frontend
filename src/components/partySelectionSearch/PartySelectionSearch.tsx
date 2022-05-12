import React, { useState } from 'react';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { Party } from '../../model/Party';
import PartySelectionSearchInput from './PartySelectionSearchInput';
import PartyItemContainer from './PartyItemContainer';

type Props = {
  parties: Array<Party>;
  onPartySelectionChange: (selectedParty: Party | null) => void;
  disableUnderline?: boolean;
  label?: string;
  iconColor?: string;
  iconMarginRight?: string;
  partyTitle?: string;
};

const verifyPartyFilter = (party: Party, filter: string) =>
  party.description.toUpperCase().indexOf(filter.toUpperCase()) >= 0;
const CustomBox = styled(Box)({
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: `inset 10px 10px  #E6E9F2`,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#0073E6',
    borderRadius: '16px',
  },
  overflowY: 'auto',
  height: '100%',
});

export default function PartySelectionSearch({
  parties,
  onPartySelectionChange,
  disableUnderline = false,
  label,
  iconColor,
  iconMarginRight,
  partyTitle,
}: Props) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [filteredParties, setFilteredParties] = useState<Array<Party>>(parties);
  const [selectedParty, setSelectedParty] = React.useState<Party | null>(null);

  const theme = useTheme();

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

  const moreThan3Parties = parties.length > 3;

  return (
    <React.Fragment>
      {parties.length >= 1 && (
        <Grid container item direction="column">
          {(partyTitle || moreThan3Parties) && (
            <Grid item my={2}>
              {moreThan3Parties ? (
                <Box>
                  <PartySelectionSearchInput
                    label={label}
                    iconMarginRight={iconMarginRight}
                    disableUnderline={disableUnderline}
                    onChange={(e) => onFilterChange(e.target.value)}
                    input={input}
                    clearField={() => onFilterChange('')}
                    iconColor={iconColor}
                  />
                </Box>
              ) : (
                parties.length >= 1 && (
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: theme.typography.fontWeightBold, color: 'text.disabled' }}
                  >
                    {partyTitle}
                  </Typography>
                )
              )}
            </Grid>
          )}

          <Grid item sx={{ overflow: 'auto', height: '220px' }}>
            <CustomBox>
              {filteredParties &&
                filteredParties.map((party) => {
                  const isDisabled = party.status === 'PENDING';
                  return (
                    <PartyItemContainer
                      moreThan3Parties={moreThan3Parties}
                      isDisabled={isDisabled}
                      key={party.partyId}
                      selectedItem={selectedParty === party}
                      title={party.description}
                      subTitle={t(roleLabels[party.userRole].longLabelKey)}
                      image={party.urlLogo}
                      chip={party.status === 'PENDING' ? t('partySelection.partyStatus') : ''}
                      action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                        handleListItemClick(event, party)
                      }
                    />
                  );
                })}
            </CustomBox>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}
