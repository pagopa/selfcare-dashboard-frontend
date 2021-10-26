import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Grid, TextField, Typography, Button } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { Party } from '../../model/Party';
import FieldsList from './../FieldsList';
// import usePartySelection from '../Hooks/usePartySelection';

export default function BodyContent() {
	const bodyTitle = "Seleziona l'Ente per cui accedi";
	const bodyDescription =
		"Potrai in ogni momento cambiare Ente/ruolo anche all'interno dell'interfaccia di gestione dei prodotti";
	const [ selectedIndex, setSelectedIndex ] = React.useState(-1);
	const [ disable, setDisable ] = React.useState(true);
	const handleListItemClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
		setSelectedIndex(index);
		setDisable(false);
	};
    const [ input, setInput ] = useState('');
	const [ parties, setParties ] = useState<Array <Party>>();
    const [ filteredParties, setFilteredParties]= useState<Array <Party>>();

	const onFilterChange = (value: string) => {
		setInput(value);
		if(!value){
			setFilteredParties(parties);
		} else {
		setFilteredParties(parties?.filter(e => e.description.toUpperCase().indexOf(value.toUpperCase())>= 0) );
		}
	};


	useEffect(() => {
		// TODO: chiamata BE
		const party: Array <Party> = [
			{ 
				role:'Manager',
				description:'Comune di Bari',
				image:'image',
				status:'Active'
			},
			{ 
				role:'Manager',
				description:'Comune di Milano',
				image:'image',
				status:'Pending'
			},
		];
		setParties(party);
		setFilteredParties(party);
	}, []);

	return (
		<Grid container display="flex" justifyContent="center" spacing={3} my={'auto'} sx={{ textAlign: 'center' }}>
			<Grid item xs={12}>
				<Box>
					<Typography variant="h5" component="h2">
						{bodyTitle}
					</Typography>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Box>
					<Typography variant="h6" component="h2">
						{bodyDescription}
					</Typography>
				</Box>
			</Grid>
			<Grid item xs={12} mx={-1} sx={{ maxWidth: '400px' }}>
				<TextField
					value={input}
					onChange={(e) => onFilterChange(e.target.value)}
					id="search"
					label="Cerca"
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<SearchOutlinedIcon />
							</InputAdornment>
						)
					}}
					variant="standard"
				/>
			</Grid>
			<Grid item xs={12}>
				{filteredParties && filteredParties.map((party, index) => ( 
						 <FieldsList
						 	disabled={party.status === 'Pending'}
							key={index}
							selectedItem={selectedIndex === index}
							title={party.description}
							image={party.image}
							action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
								handleListItemClick(event, index)}
							border={'2px'}
							borderColor={'#0073E6'}
							borderStyle="solid"
						/> 
				 ))}
			</Grid>
			<Grid item xs={12}>
					<Button 
					variant="contained" 
					disabled={disable} 
					sx={{ width: '190px' }}
					// action
					>
						Entra
					</Button>
			</Grid>
		</Grid>
	);
}
