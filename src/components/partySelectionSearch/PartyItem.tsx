import React from 'react';
import { List, ListItemButton, Typography, Grid, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CustomAvatar } from '@pagopa/selfcare-common-frontend';
// import { withStyles } from '@mui/styles/';

type Props = {
  selectedItem?: boolean;
  title?: string;
  subTitle?: string;
  image?: string;
  action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
  borderList?: string;
  disabled?: boolean;
  bgColor?: string;
  titleColor?: string;
  showAvatar?: boolean;
  pxTitleSubTitle?: string;
};

const CustomList = styled(List)({
  '& .MuiListItemButton-root': {
    '&.Mui-disabled ': {
      opacity: '0.38',
      '& .MuiGrid-container': {
        '& .chip ': {
          opacity: 'unset',
        },
      },
    },
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
    },
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
});

export default function PartyItem({
  title,
  subTitle,
  image,
  selectedItem,
  action,
  borderList,
  disabled,
  bgColor,
  titleColor,
  showAvatar = true,
  pxTitleSubTitle,
}: Props) {
  const theme = useTheme();
  return (
    <CustomList
      aria-label="main mailbox folders"
      sx={{ border: borderList, backgroundColor: bgColor }}
    >
      <ListItemButton
        sx={{ paddingLeft: 0 }}
        disableRipple
        disabled={disabled}
        selected={selectedItem}
        onClick={action}
      >
        {showAvatar && (
          <Box pl={1} pr={2}>
            <CustomAvatar customAlt="" customSrc={image} />
          </Box>
        )}
        <Grid container sx={{ px: pxTitleSubTitle }}>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: theme.typography.fontSize,
                fontWeight: theme.typography.fontWeightBold,
                color: titleColor,
              }}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">{subTitle}</Typography>
          </Grid>
        </Grid>
      </ListItemButton>
    </CustomList>
  );
}
