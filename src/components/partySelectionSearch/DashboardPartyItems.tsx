import React from 'react';
import { Grid, Box, ListItemButton, Typography, useTheme, List } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';
import { styled } from '@mui/material/styles';
import { CustomAvatar } from '@pagopa/selfcare-common-frontend';

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

type Props = {
  disabled?: boolean;
  selectedItem?: boolean;
  title: string | undefined;
  subTitle: string | undefined;
  image: string | undefined;
  chip: string;
  action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
};
export default function DashboardPartyItems({
  selectedItem,
  title,
  subTitle,
  image,
  chip,
  action,
  disabled,
}: Props) {
  const theme = useTheme();

  return (
    <Grid container data-testid={`PartyItemContainer: ${title}`}>
      <Grid item xs={disabled ? 8 : 12}>
        <CustomList aria-label="main mailbox folders" sx={{ backgroundColor: 'white' }}>
          <ListItemButton
            sx={{ paddingLeft: 0, height: '50px' }}
            disableRipple
            disabled={disabled}
            selected={selectedItem}
            onClick={action}
          >
            <Box pr={2}>
              <CustomAvatar customAlt="" customSrc={image} />
            </Box>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: theme.typography.fontSize,
                    fontWeight: theme.typography.fontWeightBold,
                    color: 'text.colorTextPrimary',
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
      </Grid>
      {disabled && (
        <Grid
          item
          xs={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Tag value={chip} color="warning" />
        </Grid>
      )}
    </Grid>
  );
}
