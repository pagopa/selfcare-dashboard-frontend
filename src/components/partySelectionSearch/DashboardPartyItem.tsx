import React from 'react';
import { Grid, Box, ListItemButton, Typography, useTheme, IconButton } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';
import { styled } from '@mui/material/styles';
import { CustomAvatar } from '@pagopa/selfcare-common-frontend';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const CustomGridContainer = styled(Grid)({
  backgroundColor: 'white',
  '& .MuiListItemButton-root.MuiListItemButton-gutters.Mui-selected': {
    borderColor: 'transparent !important',
  },
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
  iconColor?: string;
  clearField?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  moreThan3Parties?: boolean;
};
export default function DashboardPartyItem({
  selectedItem,
  title,
  subTitle,
  image,
  chip,
  action,
  disabled,
  iconColor,
  clearField,
  moreThan3Parties,
}: Props) {
  const theme = useTheme();

  return (
    <Grid container data-testid={`PartyItemContainer: ${title}`}>
      <CustomGridContainer item xs={disabled || selectedItem ? 8 : 12} p={1}>
        <ListItemButton
          sx={{
            paddingLeft: 0,
            height: '50px',
          }}
          disableRipple
          disabled={disabled}
          selected={selectedItem}
          onClick={action}
          aria-label={selectedItem ? `Selected Institution: ${title}` : undefined}
        >
          <Box pr={2}>
            <CustomAvatar customSrc={image} />
          </Box>
          <Grid container>
            <Grid item xs={12}>
              <Typography
                aria-label={title}
                data-testid={selectedItem && 'selectedMoreThen3'}
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
              <Typography variant="caption" aria-label={subTitle}>
                {subTitle}
              </Typography>
            </Grid>
          </Grid>
        </ListItemButton>
      </CustomGridContainer>
      {selectedItem && moreThan3Parties && (
        <Grid item xs={4} display="flex" justifyContent="end">
          <IconButton
            disableRipple={true}
            onClick={clearField}
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            id="clearIcon"
            aria-label="removeSelectionIcon"
          >
            <ClearOutlinedIcon sx={{ color: iconColor }} />
          </IconButton>
        </Grid>
      )}
      {disabled && (
        <Grid
          item
          xs={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          id="toBeCompletedChip"
        >
          <Tag value={chip} color="warning" aria-label={chip} />
        </Grid>
      )}
    </Grid>
  );
}
