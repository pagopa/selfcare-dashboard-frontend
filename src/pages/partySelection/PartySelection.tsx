import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Party } from '../../model/Party';
import PartySelectionTitle from './components/PartySelectionTitle';
import PartySelectionSearch from './components/PartySelectionSearch';
import PartyItemContainer from './components/PartyItemContainer';

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

export default function PartySelection() {
  const bodyTitle = "Seleziona l'Ente per cui accedi";
  const bodyDescription =
    "Potrai in ogni momento cambiare Ente/ruolo anche all'interno dell'interfaccia di gestione dei prodotti";
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [disableBtn, setBtnDisable] = React.useState(true);

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setBtnDisable(false);
  };
  const [input, setInput] = useState('');
  const [parties, setParties] = useState<Array<Party>>();
  const [filteredParties, setFilteredParties] = useState<Array<Party>>();

  const onFilterChange = (value: string) => {
    setInput(value);
    if (!value) {
      setFilteredParties(parties);
    } else {
      setFilteredParties(
        parties?.filter((e) => e.description.toUpperCase().indexOf(value.toUpperCase()) >= 0)
      );
    }
  };

  useEffect(() => {
    // TODO: chiamata BE
    const party: Array<Party> = [
      {
        role: 'Manager',
        description: 'Comune di Bari',
        image: 'image',
        status: 'Pending',
        institutionId: '1',
      },
      {
        role: 'Manager',
        description: 'Comune di Milano',
        image: 'image',
        status: 'Pending',
        institutionId: '2',
      },
      {
        role: 'Manager',
        description: 'Comune di Roma',
        image: 'image',
        status: 'Active',
        institutionId: '3',
      },
      {
        role: 'Manager',
        description: 'Comune di Napoli',
        image: 'image',
        status: 'Active',
        institutionId: '4',
      },
    ];
    setParties(party);
    setFilteredParties(party);
  }, []);

  return (
    <Grid
      container
      display="flex"
      justifyContent="center"
      spacing={2}
      my={'auto'}
      sx={{ textAlign: 'center' }}
    >
      <PartySelectionTitle bodyTitle={bodyTitle} bodyDescription={bodyDescription} />
      <PartySelectionSearch onChange={(e) => onFilterChange(e.target.value)} input={input} />
      <Grid item xs={12} container display="flex" justifyContent="center">
        <CustomBox>
          {filteredParties &&
            filteredParties.map((party, index) => {
              const isDisabled = party.status === 'Pending';
              return (
                <PartyItemContainer
                  isDisabled={isDisabled}
                  disabled={isDisabled}
                  key={party.institutionId}
                  borderList={selectedIndex === index ? '2px solid #0073E6' : 'transparent'}
                  selectedItem={selectedIndex === index}
                  title={party.description}
                  subTitle={party.role}
                  titleColor={isDisabled ? '' : '#0073E6'}
                  image={party.image}
                  chip={party.status === 'Pending' ? 'Da completare' : ''}
                  action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    handleListItemClick(event, index)
                  }
                />
              );
            })}
        </CustomBox>
      </Grid>
      <Grid item xs={12}>
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
