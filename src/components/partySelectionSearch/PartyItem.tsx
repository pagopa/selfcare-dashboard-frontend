import React from 'react';
import { ListItemButton, Typography, Grid, Box } from '@mui/material';
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
  titleSize?: string;
  subTitleSize?: string;
  showAvatar?: boolean;
  pxTitleSubTitle?: string;
};

const CustomListItemButton = styled(ListItemButton)({
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
  titleSize,
  subTitleSize,
  showAvatar = true,
  pxTitleSubTitle,
}: Props) {
  return (
    <CustomListItemButton
      sx={{ paddingLeft: 0, border: borderList, backgroundColor: bgColor }}
      disableRipple
      disabled={disabled}
      selected={selectedItem}
      aria-label={selectedItem ? `Selected Institution: ${title}` : undefined}
      onClick={action}
    >
      {showAvatar && (
        <Box pl={1} pr={2}>
          <CustomAvatar customAlt="" customSrc={image} />
        </Box>
      )}
      <Grid container sx={{ px: pxTitleSubTitle }}>
        <Grid item xs={12} aria-label={title}>
          <Typography variant="h1" sx={{ fontSize: titleSize, color: titleColor }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} aria-label={subTitle}>
          <Typography variant="caption" sx={{ fontSize: subTitleSize }}>
            {subTitle}
          </Typography>
        </Grid>
      </Grid>
    </CustomListItemButton>
  );
}
