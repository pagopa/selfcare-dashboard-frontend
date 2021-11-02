import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Party } from '../../../model/Party';
import PartySelectionTitle from './components/PartySelectionTitle';
import PartySelectionSearch from './components/PartySelectionSearch';
import PartyItemContainer from './components/PartyItemContainer';

const verifyPartyFilter = (party: Party, filter: string) => party.description.toUpperCase().indexOf(filter.toUpperCase()) >= 0;
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
  width: 400,
  overflowY: 'auto',
  height: '200px',
});

type Props={
 parties: Array<Party>;
};

export default function PartySelection({parties}: Props) {
  const bodyTitle = "Seleziona l'Ente per cui accedi";
  const bodyDescription =
    "Potrai in ogni momento cambiare Ente/ruolo anche all'interno dell'interfaccia di gestione dei prodotti";
  const [selectedParty, setSelectedParty] = React.useState<Party | null>(null);
  const [disableBtn, setBtnDisable] = React.useState(true);

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    party: Party
  ) => {
    setSelectedParty(party);
    setBtnDisable(false);
  };
  const [input, setInput] = useState('');
 
  const [filteredParties, setFilteredParties] = useState<Array<Party>>(parties);

  const onFilterChange = (value: string) => {

    setInput(value);
    if (!value) {
      setFilteredParties(parties);
    } else {
      setFilteredParties(
        parties?.filter(e => verifyPartyFilter(e, value)));
    }
    if(value && selectedParty && !verifyPartyFilter(selectedParty, value)){
      setSelectedParty(null);
      setBtnDisable(true);
    };
  };
  
  return (
    <Grid
    direction="column"
    container
    display="flex"
    justifyContent="center"
    spacing={2}
    my={'auto'}
    sx={{ textAlign: 'center' }}
    >
       <Grid item container justifyContent="center">
        <Grid item xs={8}>
          <PartySelectionTitle bodyTitle={bodyTitle} bodyDescription={bodyDescription} />
        </Grid>
      </Grid>

      <Grid item container justifyContent="center">
        <Grid item xs={4}>
          { parties.length > 3 && <PartySelectionSearch onChange={(e) => onFilterChange(e.target.value)} input={input} />}
        </Grid>
      </Grid>

      <Grid item xs={12} display="flex" justifyContent="center">
        <CustomBox>
          {filteredParties &&
            filteredParties.map((party) => {
              const isDisabled = party.status === 'Pending';
              return (
                <PartyItemContainer
                  isDisabled={isDisabled}
                  disabled={isDisabled}
                  key={party.institutionId}
                  borderList={selectedParty === party ? '2px solid #0073E6' : 'transparent'}
                  selectedItem={selectedParty === party}
                  title={party.description}
                  subTitle={party.role}
                  titleColor={isDisabled ? '' : '#0073E6'}
                  image={party.image}
                  chip={party.status === 'Pending' ? 'Da completare' : ''}
                  action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    handleListItemClick(event, party)
                  }
                />
              );
            })}
        </CustomBox>
      </Grid>

      <Grid item xs={2} > 
        <Button
          variant="contained"
          disabled={disableBtn}
          sx={{ width: '190px', height: '40px' }}
          // action
        >
          Entra
        </Button>
        </Grid>
    </Grid>
  );
}
