import React from 'react';
import { Box } from '@mui/system';
import { Avatar, List, ListItemButton, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
// import { withStyles } from '@mui/styles/';



type Props = {
	selectedItem?: boolean;
    title?: string;
	subTitle?:string;
    image?: string;
	action?: React.Dispatch<React.MouseEvent <HTMLDivElement, MouseEvent >>;
	borderList?: string;
	disabled: boolean;
	bgColor?: string;
	titleColor?:string;
	titleSize?:string;
	subTitleSize?:string;
	chipText?:string;
	};

const CustomList = styled(List)({ 
	"& .MuiListItemButton-root": {
		"&.Mui-selected": {
			backgroundColor:'transparent !important',
			},
		"&:hover":{
			backgroundColor:'transparent !important',
			  }
		 },
	});
export default function FieldsList({title,subTitle, image, selectedItem, action, borderList, disabled, bgColor,titleColor,titleSize,subTitleSize,chipText}: Props) {
	
	return (
		<Box sx={{ width: '100%', maxWidth: 370}} mx={"auto"} >
			<CustomList aria-label="main mailbox folders" sx={{ border:borderList,backgroundColor:bgColor}}>
				<ListItemButton
					disableRipple
					disabled={disabled}
					selected={ selectedItem }
					onClick={action}	
				>
					 <Box mx={2}>
                        <Avatar alt="Remy Sharp" src={image} />
                    </Box>
					<Grid container >
						<Grid xs={disabled ? 8 : 12}>
							<Typography variant="h1" sx={{fontSize:titleSize, color:titleColor }}> {title} </Typography>
						</Grid>
						{disabled && 
						<Grid xs={4} sx={{borderRadius:'56px', backgroundColor:'#0073E6', fontSize:'12px',display:'flex',justifyContent:'space-around'}}>
							<Typography variant="caption" sx={{fontSize:'12px',  color:'#FFFFFF'}}>{chipText}</Typography>
						</Grid>}
						<Grid xs={12}>
							<Typography variant="caption" sx={{fontSize:subTitleSize}}> {subTitle} </Typography>
						</Grid>
					</Grid>
				</ListItemButton>
			</CustomList>
		</Box>
	);
}
