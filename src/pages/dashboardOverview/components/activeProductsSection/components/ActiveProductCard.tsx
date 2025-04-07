import { ArrowForward } from '@mui/icons-material';
import { Box, Card, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SubProductResource } from '../../../../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { PRODUCT_IDS } from '../../../../../utils/constants';

type Props = {
  cardTitle: string;
  buttonLabel: string;
  disableBtn: boolean;
  urlLogo: string;
  btnAction?: () => void;
  party: Party;
  product: Product;
};
// eslint-disable-next-line sonarjs/cognitive-complexity
export default function ActiveProductCard({
  cardTitle,
  disableBtn,
  urlLogo,
  btnAction,
  party,
  product,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const theme = useTheme();

  const activeSubProducts: Array<SubProductResource> = useMemo(
    () =>
      product.subProducts?.filter((p) =>
        party.products.some(
          (us) => us.productId === p.id && us.productOnBoardingStatus === 'ACTIVE'
        )
      ) ?? [],
    [party]
  );

  const isSubProductActive = activeSubProducts && activeSubProducts.length > 0;
  const logoUrl =
    product.id === 'prod-io' && isSubProductActive ? activeSubProducts[0].logo ?? '' : urlLogo;
  const logoBgColor =
    product.id === 'prod-io' && isSubProductActive
      ? activeSubProducts[0].logoBgColor ?? ''
      : product.logoBgColor;

  return (
    <Card
      id={product.id}
      raised
      sx={{
        borderRadius: theme.spacing(2),
        minHeight: '154px',
        background: '#FFFFFF',
        boxShadow:
          '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
        overflowWrap: 'anywhere',
      }}
    >
      <Grid container alignItems={disableBtn ? 'flex-start' : 'center'} flexWrap={'nowrap'} p={2}>
        {/* Logo */}
        <Grid item xs={'auto'} mr={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: '72px',
              height: '72px',
              padding: 1,
              backgroundColor: logoBgColor,
              boxSizing: 'border-box',
              borderRadius: theme.spacing(1),
            }}
          >
            <img
              src={logoUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
              alt={`${product.title} logo`}
            />
          </Box>
        </Grid>
        {/* Title and disableBtn info */}
        <Grid item xs={disableBtn ? 9 : true}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={disableBtn ? 'flex-start' : 'center'}
            height="100%"
          >
            {cardTitle && (
              <Tooltip title={cardTitle.length > 20 ? cardTitle : ''} placement="top" arrow>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '24px',
                    fontWeight: '400',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical' as const,
                    WebkitLineClamp: 2,
                  }}
                >
                  <strong style={{ fontWeight: 'fontWeightBold' }}>{cardTitle}</strong>
                  {` ${t(
                    isSubProductActive && product.id === PRODUCT_IDS.IO
                      ? 'overview.activeProducts.premiumProduct'
                      : ''
                  )}`}
                </Typography>
                {/*
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 'fontWeightBold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical' as const,
                    WebkitLineClamp: 2,
                  }}
                >
                  
                  {`${cardTitle} ${t(
                    isSubProductActive ? 'overview.activeProducts.premiumProduct' : ''
                  )}`}
                </Typography>
                */}
              </Tooltip>
            )}

            {disableBtn && (
              <Typography sx={{ fontSize: '14px', mt: 1 }}>
                {t('activeProductCard.disableInfo')}
              </Typography>
            )}
          </Box>
        </Grid>
        {/* Arrow Button */}
        {!disableBtn && (
          <Grid item>
            <IconButton onClick={btnAction} disabled={disableBtn} id={`forward_${product.id}`} color='primary'>
              <ArrowForward />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Card>
  );
}
