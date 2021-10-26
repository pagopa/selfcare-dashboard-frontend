import React from 'react';
import { Box } from '@mui/system';
import { Avatar, List, ListItemButton, ListItemText, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
// import { withStyles } from '@mui/styles/';



type Props = {
	selectedItem?: boolean;
    title?: string;
	subTitle?:string;
    image?: string;
	action?: React.Dispatch<React.MouseEvent <HTMLDivElement, MouseEvent >>;
	border?: string;
	disabled: boolean;
	bgColor?: string;
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
export default function FieldsList({title,subTitle, image, selectedItem, action, border, disabled, bgColor}: Props) {
	
	return (
		<Box sx={{ width: '100%', maxWidth: 370, bgcolor: 'background.paper'}} mx={"auto"} >
			<CustomList aria-label="main mailbox folders" sx={{border:{border},backgroundColor:{bgColor}}}>
				<ListItemButton
					disableRipple
					disabled={disabled}
					selected={ selectedItem }
					onClick={action}	
				>
					 <Box mx={2}>
                        <Avatar alt="Remy Sharp" src={image} />
                    </Box>

					<Box>
						<ListItemText primary={title} />
						<ListItemText primary={subTitle} />
					</Box>

					<Grid>
						<Grid>
						</Grid>
							
						<Grid>
						</Grid>
					</Grid>
				</ListItemButton>
			</CustomList>
		</Box>
	);
}
