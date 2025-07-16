import { Divider, Grid, Tooltip, Typography } from '@mui/material';
import { ReactNode } from 'react';

type PartyDetailFieldProps = {
  label: string;
  value: string | ReactNode;
  tooltipText?: string;
  showDivider?: boolean;
};

export const PartyDetailField = ({
  label,
  value,
  tooltipText = '',
  showDivider = true,
}: PartyDetailFieldProps) => {
  const infoStyles = {
    fontWeight: 'fontWeightMedium',
    fontSize: 'fontSize',
    maxWidth: '100% !important',
  };

  const labelStyles = {
    color: 'text.secondary',
    fontSize: '14px',
    fontWeight: '400',
  };

  return (
    <>
      {showDivider && (
        <Grid item xs={12}>
          <Divider sx={{ mb: 1 }} />
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body2" sx={labelStyles}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Tooltip title={tooltipText} placement="top" arrow>
          <Typography sx={infoStyles} className="ShowDots">
            {value}
          </Typography>
        </Tooltip>
      </Grid>
    </>
  );
};
