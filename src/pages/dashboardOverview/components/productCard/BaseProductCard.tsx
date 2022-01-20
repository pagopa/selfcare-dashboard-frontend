import React, { useState } from 'react';
import { Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import SessionModal from '@pagopa/selfcare-common-frontend/components/SessionModal';

type Props = {
  cardTitle: string;
  cardSubTitle?: string;
  buttonLabel: string;
  disableBtn: boolean;
  logoCard?: string;
  tag?: string;
  btnAction?: () => void;
  heightLogo?: string;
  heightTitle?: string;
  heightSubTitle?: string;
  heightButton?: string;
  status?: string;
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
  logoCard,
  tag,
  btnAction,
  heightLogo,
  heightTitle,
  heightSubTitle,
  heightButton,
  status,
  titleFontSize = '32px',
  subTitleFontSize = '18px',
}: Props) {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  return (
    <React.Fragment>
      <Card sx={{ border: 'none', boxShadow: 'none' }}>
        <CardContent>
          <Grid container height={heightLogo}>
            <Grid item xs={6} mb={3}>
              <Box sx={{ width: '100%' }}>
                <img src={`data:image/png;base64,${logoCard}`} />
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
                    {tag}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} height={heightTitle} display="flex" alignItems={'center'}>
            {cardTitle && (
              <Typography variant="h2" sx={{ fontSize: titleFontSize }}>
                {cardTitle}
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
                {cardSubTitle}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} justifyContent="center" height={heightButton}>
            <Box sx={{ width: '100%' }}>
              <Button
                onClick={status === 'PENDING' ? () => setOpenLogoutModal(true) : btnAction}
                disabled={disableBtn}
                variant="contained"
                sx={{ width: '100%', height: '48px' }}
              >
                {buttonLabel}
              </Button>
            </Box>
          </Grid>
        </CardContent>
      </Card>
      <SessionModal
        handleClose={() => setOpenLogoutModal(false)}
        onConfirm={btnAction}
        open={openLogoutModal}
        title={'Adesione in corso'}
        message={
          'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?'
        }
        onConfirmLabel={'Procedi con una nuova adesione'}
      />
    </React.Fragment>
  );
}
