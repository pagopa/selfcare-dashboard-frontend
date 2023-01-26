import React, { useState } from 'react';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { Party } from '../../model/Party';
import PartySelectionSearchInput from './PartySelectionSearchInput';
import PartyItemContainer from './PartyItemContainer';
import PartyAccountItemSelection from './PartyAccountItemSelection';

type Props = {
  parties: Array<Party>;
  selectedParty: Party | null;
  onPartySelectionChange: (selectedParty: Party | null) => void;
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
  selectedParty,
  onPartySelectionChange,
  label,
  iconColor,
  iconMarginRight,
  partyTitle,
}: Props) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [filteredParties, setFilteredParties] = useState<Array<Party>>(parties);

  const theme = useTheme();

  const onFilterChange = (value: string) => {
    setInput(value);
    if (!value) {
      setFilteredParties(parties);
    } else {
      setFilteredParties(parties?.filter((e) => verifyPartyFilter(e, value)));
    }
    if (value && selectedParty && !verifyPartyFilter(selectedParty, value)) {
      onPartySelectionChange(null);
    }
  };

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    party: Party
  ) => {
    onPartySelectionChange(party);
  };

  const moreThan3Parties = parties.length > 3;

  return (
    <React.Fragment>
      {parties.length >= 1 && (
        <Grid container item direction="column">
          {(partyTitle || moreThan3Parties) && !selectedParty && (
            <Grid item my={2}>
              {moreThan3Parties ? (
                <PartySelectionSearchInput
                  label={label}
                  iconMarginRight={iconMarginRight}
                  onChange={(e) => onFilterChange(e.target.value)}
                  input={input}
                  clearField={() => onFilterChange('')}
                  iconColor={iconColor}
                />
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

          <Grid
            item
            sx={{
              overflow: 'auto',
              height: 'auto',
              maxHeight: moreThan3Parties ? '220px' : '270px',
            }}
          >
            {selectedParty && moreThan3Parties ? (
              <PartyAccountItemSelection
                selectedParty={selectedParty}
                clearField={() => onPartySelectionChange(null)}
              />
            ) : (
              <>
                {filteredParties.length === 0 ? (
                  <Typography
                    py={2}
                    sx={{
                      fontSize: '18px',
                      fontWeight: 'fontWeightBold',
                      display: 'flex',
                      justifyContent: 'flex-start',
                    }}
                  >
                    {t('partySelection.notFoundResults')}
                  </Typography>
                ) : (
                  <CustomBox sx={{ pointerEvents: parties.length !== 1 ? 'auto' : 'none' }}>
                    {filteredParties &&
                      filteredParties.map((party) => {
                        const isDisabled =
                          party.status === 'PENDING' || party.status === 'TOBEVALIDATED';
                        return (
                          <PartyItemContainer
                            moreThan3Parties={moreThan3Parties}
                            isDisabled={isDisabled}
                            key={party.partyId}
                            selectedItem={parties.length !== 1 ? selectedParty === party : false}
                            title={party.description}
                            subTitle={t(roleLabels[party.userRole].longLabelKey)}
                            image={party.urlLogo}
                            chip={
                              party.status === 'PENDING'
                                ? t('partySelection.partyStatus.pending')
                                : party.status === 'TOBEVALIDATED'
                                ? t('partySelection.partyStatus.toBeValidated')
                                : ''
                            }
                            action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                              handleListItemClick(event, party)
                            }
                          />
                        );
                      })}
                  </CustomBox>
                )}
              </>
            )}
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}
