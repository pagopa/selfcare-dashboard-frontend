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
	};

const CustomList = styled(List)({ 
	"& .MuiListItemButton-root": {
		"&.Mui-disabled ": {
				opacity:'0.38',
				"& .MuiGrid-container":{ 
					"& .chip ":{
						opacity:'unset',
					}
				}
			},
		"&.Mui-selected": {
			backgroundColor:'transparent !important',
			},
		"&:hover":{
			backgroundColor:'transparent !important',
			  }
		 },
	});

export default function PartyItem({title,subTitle, image, selectedItem, action, borderList, disabled, bgColor,titleColor,titleSize,subTitleSize}: Props) {
	
	return (
		<Box sx={{ width: '100%', maxWidth: 370}} >
			<CustomList aria-label="main mailbox folders" sx={{ border:borderList,backgroundColor:bgColor}}>
				<ListItemButton
					sx={{paddingLeft:0}}
					disableRipple
					disabled={disabled}
					selected={ selectedItem }
					onClick={action}	
				>
					 <Box pl={1} pr={2}>
                        <Avatar alt="" src={image} />
                    </Box>
					<Grid container>
						<Grid xs={12}>
							<Typography variant="h1" sx={{fontSize:titleSize, color:titleColor }}> {title} </Typography>
						</Grid>				
						<Grid xs={12}>
							<Typography variant="caption" sx={{fontSize:subTitleSize}}> {subTitle} </Typography>
						</Grid>
					</Grid>
				</ListItemButton>
			</CustomList>
		</Box>
	);
}
