import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import PartyItem from './PartyItem';

type Props = {
  isDisabled?: boolean;
  disabled?: boolean;
  borderList?: string;
  selectedItem?: boolean;
  title: string | undefined;
  subTitle: string | undefined;
  titleColor: string;
  image: string | undefined;
  chip: string;
  action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
};
export default function PartyItemContainer({
  isDisabled,
  borderList,
  selectedItem,
  title,
  subTitle,
  titleColor,
  image,
  chip,
  action,
}: Props) {
  return (
    <Grid
      container
      direction={'row'}
      role="PartyItemContainer"
      data-testid={`PartyItemContainer: ${title}`}
      sx={{ boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)' }}
    >
      <Grid item xs={isDisabled ? 8 : 12}>
        <Box>
          <PartyItem
            bgColor="transparent"
            borderList={borderList}
            disabled={isDisabled}
            selectedItem={selectedItem}
            title={title}
            subTitle={subTitle}
            titleColor={titleColor}
            titleSize="16px"
            subTitleSize="14px"
            image={image}
            action={action}
          />
        </Box>
      </Grid>
      {isDisabled && (
        <Grid item xs={4}>
          <Box>
            <Grid
              className="chip"
              sx={{
                borderRadius: '56px',
                backgroundColor: '#00C5CA',
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '20px',
                marginRight: '20px',
              }}
            >
              <Typography
                role="PartyItemDisabled"
                variant="caption"
                sx={{ fontSize: '12px', fontWeight: '600' }}
              >
                {chip}
              </Typography>
            </Grid>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
