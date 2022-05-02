import React from 'react';
import { Typography, Button, Box, Grid, Card, CardContent, Tooltip } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

type Props = {
  cardTitle: string;
  cardSubTitle?: string;
  buttonLabel: string;
  disableBtn: boolean;
  urlLogo?: string;
  tag?: string;
  btnAction?: () => void;
  heightLogo?: string;
  heightTitle?: string;
  heightSubTitle?: string;
  heightButton?: string;
  titleFontSize?: string;
  subTitleFontSize?: string;
  tooltip: string;
};

const cardSubTitleStyle = {
  height: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical' as const,
};

export default function BaseProductCard({
  cardTitle,
  cardSubTitle,
  buttonLabel,
  disableBtn,
  urlLogo,
  btnAction,
  heightTitle,
  heightSubTitle,
  heightButton,
  subTitleFontSize = '18px',
  tooltip,
}: Props) {
  return (
    <React.Fragment>
      <Card
        sx={{
          border: 'none',
          borderRadius: '16px !important',
          boxShadow:
            '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
        }}
      >
        <CardContent>
          {/* {tag && (
            <Grid item xs={12} display="flex" justifyContent="end">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  maxWidth: '103px',
                  minWidth: '50px',
                  height: '18px',
                  backgroundColor: '#00C5CA',
                  color: 'text.primary',
                  padding: '0 10px',
                  borderRadius: '56px',
                }}
              >
                <Typography
                  title={tag}
                  sx={{
                    fontSize: '12px',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tag}
                </Typography>
              </Box>
            </Grid>
          )} */}
          <Box display="flex">
            <Box sx={{ width: '88px', height: '88px' }} mr={2}>
              <img src={urlLogo} />
            </Box>
            {cardTitle && (
              <Box height={heightTitle} display="flex" alignItems={'center'}>
                <Typography variant="h4">{cardTitle}</Typography>
              </Box>
            )}
          </Box>
          {cardSubTitle && (
            <Grid item xs={12} mb={3} height={heightSubTitle} display="flex" alignItems={'center'}>
              <Typography
                variant="body2"
                sx={{ ...cardSubTitleStyle, fontSize: subTitleFontSize }}
                title={cardSubTitle.toString()}
              >
                {cardSubTitle}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} justifyContent="center" height={heightButton}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={btnAction}
                disabled={disableBtn}
                variant="contained"
                sx={{ height: '40px' }}
              >
                {buttonLabel}
              </Button>
              {disableBtn && (
                <Box
                  display="flex"
                  alignItems="center"
                  ml={3}
                  sx={{ color: '#5C6F82', cursor: 'pointer' }}
                >
                  <Tooltip title={tooltip}>
                    <InfoOutlined />
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
