import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Grid, TextField, Typography, Button } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import { Party } from '../../model/Party';
import FieldsList from './../FieldsList';

const CustomBox = styled(Box)({
		"&::-webkit-scrollbar": {
			width: 8,
		  },
		  "&::-webkit-scrollbar-track": {
			boxShadow: `inset 10px 10px  #E6E9F2`,
		  },
		  "&::-webkit-scrollbar-thumb": {
			backgroundColor: "#0073E6",
		  },
  });

export default function BodyContent() {
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
        status: 'Active',
      },
      {
        role: 'Manager',
        description: 'Comune di Milano',
        image: 'image',
        status: 'Pending',
      },
      {
        role: 'Manager',
        description: 'Comune di Roma',
        image: 'image',
        status: 'Active',
      },
      {
        role: 'Manager',
        description: 'Comune di Napoli',
        image: 'image',
        status: 'Active',
      },
      {
        role: 'Manager',
        description: 'Comune di Torino',
        image: 'image',
        status: 'Active',
      },
      {
        role: 'Manager',
        description: 'Comune di Ancona',
        image: 'image',
        status: 'Active',
      },
      {
        role: 'Manager',
        description: 'Comune di Milano',
        image: 'image',
        status: 'Pending',
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
      spacing={1}
      my={'auto'}
      sx={{ textAlign: 'center' }}
    >
      <Grid item xs={12}>
        <Box>
          <Typography variant="h3" component="h2">
            {bodyTitle}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <Typography variant="subtitle2" component="h2">
            {bodyDescription}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} mx={-1} display="flex" justifyContent="center">
        <Box sx={{ width: '400px' }}>
          <TextField
            sx={{ width: '100%' }}
            value={input}
            onChange={(e) => onFilterChange(e.target.value)}
            id="search"
            label="Cerca"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Box>
      </Grid>
      <Grid item xs={12} container display="flex" justifyContent="center">
        <CustomBox sx={{ width: 400, overflowY: 'scroll', maxHeight: '230px' }}>
          {filteredParties &&
            filteredParties.map((party, index) => (
              <Box key={index}>
                <FieldsList
                  bgColor="transparent"
                  border={selectedIndex === index ? '2px solid #0073E6' : 'transparent'}
                  disabled={party.status === 'Pending'}
                  selectedItem={selectedIndex === index}
                  title={party.description}
				  subTitle={party.role}
                  image={party.image}
                  action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    handleListItemClick(event, index)
                  }
                />
              </Box>
            ))}
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
