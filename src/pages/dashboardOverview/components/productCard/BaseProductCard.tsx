import React from 'react';
import { Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  tag,
  btnAction,
  heightLogo,
  heightTitle,
  heightSubTitle,
  heightButton,
  titleFontSize = '32px',
  subTitleFontSize = '18px',
}: Props) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Card sx={{ border: 'none', boxShadow: 'none' }}>
        <CardContent>
          <Grid container height={heightLogo}>
            <Grid item xs={6} mb={3}>
              <Box sx={{ width: '100%' }}>
                <img src={urlLogo} />
              </Box>
            </Grid>
            {tag && (
              <Grid item xs={6} display="flex" justifyContent="end">
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
                    {tag ? t('overview.activeProductCard.tag', { tag: `${tag}` }) : ''}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} height={heightTitle} display="flex" alignItems={'center'}>
            {cardTitle && (
              <Typography variant="h2" sx={{ fontSize: titleFontSize }}>
                {t('overview.activeProductCard.productName', { productName: `${cardTitle}` })}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} mb={3} height={heightSubTitle} display="flex" alignItems={'center'}>
            {cardSubTitle && (
              <Typography
                variant="body2"
                sx={{ ...cardSubTitleStyle, fontSize: subTitleFontSize }}
                title={cardSubTitle.toString()}
              >
                {t('overview.activeProductCard.activationOf', { activationOf: `${cardSubTitle}` })}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} justifyContent="center" height={heightButton}>
            <Box sx={{ width: '100%' }}>
              <Button
                onClick={btnAction}
                disabled={disableBtn}
                variant="contained"
                sx={{ width: '100%', height: '48px' }}
              >
                {t('overview.activeProductCard.manageButton', { manageButton: `${buttonLabel}` })}
              </Button>
            </Box>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
