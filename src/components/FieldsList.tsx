import React from 'react';
import { Box } from '@mui/system';
import { Avatar, List, ListItemButton, ListItemText } from '@mui/material';


type Props = {
	selectedItem?: boolean;
    title?: string;
    image?: string;
	action?: React.Dispatch<React.MouseEvent <HTMLDivElement, MouseEvent >>;
	border?: string;
	borderColor?:string;
	borderStyle?:string;
	disabled: boolean;
	};

export default function FieldsList({title, image, selectedItem, action, border, borderColor, borderStyle,disabled}: Props) {
	
	return (
		<Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} m={"auto"}>
			<List component="nav" aria-label="main mailbox folders" sx={{border:{border}, borderColor:{borderColor}, borderStyle:{borderStyle}, marginBottom:"10px"}}>
				<ListItemButton
					disabled={disabled}
					selected={ selectedItem }
					onClick={action}
					
					
				>
					 <Box mx={2}>
                        <Avatar alt="Remy Sharp" src={image} />
                    </Box>
					<ListItemText primary={title} />
				</ListItemButton>
			</List>
		</Box>
	);
}
